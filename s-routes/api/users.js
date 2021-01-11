// [REQUIRE] //
const bcrypt = require('bcryptjs')
const cors = require('cors')
const express = require('express')
const jwt = require('jsonwebtoken')
const validator = require('validator')


// [REQUIRE] Personal //
const config = require('../../s-config')
const rateLimiters = require('../../s-rate-limiters')
const activitiesCollection = require('../../s-collections/activitiesCollection')
const passwordRecoveriesCollection = require('../../s-collections/passwordRecoveriesCollection')
const userReportsCollection = require('../../s-collections/userReportsCollection')
const usersCollection = require('../../s-collections/usersCollection')
const verificationCodesCollection = require('../../s-collections/verificationCodesCollection')
const Auth = require('../../s-middleware/Auth')
const mailerUtil = require('../../s-utils/mailerUtil')


// [INIT] //
const secretKey = config.SECRET_KEY


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/
// [READ] Auth Required - Decoded //
router.get(
	'/read',
	Auth.userTokenByPassVerification(),
	async (req, res) => {
		try {
			const userObj = await usersCollection.c_readSelect(
				req.decoded.user_id,
				'_id first_name last_name username bio verified created_at profile_img'
			)
			res.status(200).send(userObj)
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/users: Error --> ${err}`,
			})
		}
	}
)


// [READ] Params //
router.get(
	'/read/:user_id',
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (validator.isAscii(req.params.user_id)) {
				const userObj = await usersCollection.c_readSelect(
					req.params.user_id,
					'_id first_name last_name username bio verified created_at profile_img'
				)

				res.status(200).send(userObj)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/users: Invalid user_id'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/users: Error --> ${err}`,
			})
		}
	}
)


// [UPDATE] Auth Required //
router.post(
	'/update',
	Auth.userToken(),
	async (req, res) => {
		// [VALIDATE] //
		try {
			if (
				validator.isAscii(req.body.img_url) &&
				validator.isAscii(req.body.bio)
			) {
				const returned = await usersCollection.c_update(
					req.decoded.user_id,
					req.body.img_url,
					req.body.bio
				)
		
				res.status(200).send(returned)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/users: Invalid params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/users: Error --> ${err}`,
			})
		}
	}
)


/******************* [LOGIN/REGISTER] *******************/
// [LOGIN] //
router.post(
	'/login',
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.body.email) &&
				validator.isAscii(req.body.password)
			) {
				// [VALIDATE] email //
				if (validator.isEmail(req.body.email)) {
					// [VALIDATE] password //
					if (validator.isAscii(req.body.password)) {
						const userObj = await usersCollection.c_readByEmail(
							req.body.email
						)

						if (userObj.user) {
							// [VALIDATE-PASSWORD] //
							if (bcrypt.compareSync(req.body.password, userObj.user.password)) {
								const token = jwt.sign(
									{
										user_id: userObj.user._id,
										email: userObj.user.email,
										username: userObj.user.username,
										first_name: userObj.user.first_name,
										last_name: userObj.user.last_name,
										verified: userObj.user.verified
									},
									secretKey,
									{/* expiresIn: 7200 */}
								)
						
								res.status(200).send({
									executed: true,
									status: true,
									message: 'success',
									validation: true,
									token: token,
								})
							}
							else {
								res.status(200).send({
									executed: true,
									status: true,
									message: 'Invalid email or password',
									validation: false,
								})
							}
						}
						else {
							res.status(200).send({
								executed: true,
								status: true,
								message: 'Invalid email or password',
								validation: false
							})
						}
					}
					else {
						res.status(200).send({
							executed: true,
							status: false,
							message: '/api/users: Invalid email'
						})
					}
				}
				else {
					res.status(200).send({
						executed: true,
						status: false,
						message: '/api/users: Invalid password'
					})
				}
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/users: Invalid Params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/users: Error --> ${err}`,
			})
		}
	}
)


// [REGISTER] //
router.post(
	'/register',
	rateLimiters.registrationLimiter,
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.body.username) &&
				validator.isAscii(req.body.email) &&
				validator.isAscii(req.body.password)
			) {
			
				// [CREATE] Register Account //
				const user = await usersCollection.c_register(
					req.body.username,
					req.body.email,
					req.body.password,
				)

				if (user.status && user.created) {
					// [CREATE] Verification Code //
					const vCode = await verificationCodesCollection.c_create(
						user.user._id
					)

					// [MAIL] Verification Email //
					await mailerUtil.sendVerificationMail(
						user.user.email,
						user.user._id,
						vCode.verificationCode.verificationCode
					)

					// [CREATE] Activity //
					const activity = await activitiesCollection.c_create(
						user.user._id,
						'user',
						undefined,
						user.user._id,
						undefined,
						undefined,
					)

					if (activity.status) {
						res.status(200).send({
							executed: true,
							status: true,
							user: user.user,
							created: true,
							activity: activity,
						})
					}
					else { res.status(200).send(activity) }
				}
				else { res.status(200).send(user) }
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/users: Invalid Params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/users: Error --> ${err}`,
			})
		}
	}
)


/******************* [VERIFICATION] *******************/
router.post(
	'/verify',
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.body.user_id) &&
				validator.isAscii(req.body.verificationCode)
			) {
				// [EXISTANCE] //
				const valid = await verificationCodesCollection.c_validate(
					req.body.user_id,
					req.body.verificationCode
				)

				if (valid.status && valid.existance) {
					// [UPDATE] Verify User //
					usersCollection.c_verify(req.body.user_id)
				}

				res.status(200).send(valid)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/users: Invalid params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/users: Error --> ${err}`,
			})
		}
	}
)


router.post(
	'/resend-verification-email',
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (validator.isAscii(req.body.email)) {
				// [READ] Get User by Email //
				const user = await usersCollection.c_getIdByEmail(req.body.email)

				// [READ] verificationCode by user_id //
				const vCode = await verificationCodesCollection.c_read(
					user.user._id
				)
				
				// [SEND-MAIL] //
				mailerUtil.sendVerificationMail(
					req.body.email,
					user.user._id,
					vCode.verificationCode.verificationCode
				)

				res.status(200).send({
					executed: true,
					status: true,
					message: 'Verification email sent'
				})
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/users: Invalid params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/users: Error --> ${err}`,
			})
		}
	}
)


/******************* [PASSWORD] *******************/
router.post(
	'/reset-password',
	Auth.userToken(),
	async (req, res) => {
		try {
			if (
				validator.isAscii(req.body.currentPassword) &&
				validator.isAscii(req.body.password)
			) {
				const userObj = await usersCollection.c_read(
					req.decoded.user_id
				)
				
				if (userObj.status) {
					// [VALIDATE-PASSWORD] //
					if (bcrypt.compareSync(req.body.currentPassword, userObj.user.password)) {		
						// [UPDATE] Password //
						const updatedPwd = await usersCollection.c_updatePassword(
							req.decoded.user_id,
							req.body.password
						)

						res.status(200).send(updatedPwd) 
					}
					else {
						res.status(200).send({
							executed: true,
							status: false,
							message: 'Invalid password',
						})
					}
				}
				else {
					res.send(userObj)
				}
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/users: Invalid Params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/users: Error --> ${err}`,
			})
		}
	}
)


router.post(
	'/request-password-reset',
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (validator.isAscii(req.body.email)) {
				const user = await usersCollection.c_getIdByEmail(req.body.email)
				
				if (user.status) {
					// [CREATE] Password Recovery //
					const passwordRecovery = await passwordRecoveriesCollection.c_create(
						user.user._id
					)
					
					if (passwordRecovery.status && !passwordRecovery.existance) {
						// [SEND-MAIL] //
						const email = await mailerUtil.sendPasswordResetEmail(
							req.body.email,
							user.user._id,
							passwordRecovery.passwordRecovery.verificationCode
						)
						
						res.status(200).send(email)
					}
					else { res.status(200).send(passwordRecovery) }
				}
				else { res.status(200).send(user) }
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/users: Invalid params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/users: Error --> ${err}`,
			})
		}
	}
)


router.post(
	'/not-logged-reset-password',
	async (req, res) => {
		try {
			if (
				validator.isAscii(req.body.user_id) &&
				validator.isAscii(req.body.verificationCode) &&
				validator.isAscii(req.body.password)
			) {
				// [EXISTANCE] PasswordRecovery //
				const existance = await passwordRecoveriesCollection.c_existance(
					req.body.user_id
				)

				if (existance.existance) {
					// [VALIDATE] passwordRecovery //
					const pwdRecovery = await passwordRecoveriesCollection.c_validateToken(
						req.body.user_id,
						req.body.verificationCode
					)

					if (pwdRecovery.status && pwdRecovery.valid) {
						// [UPDATE] Password //
						const updatedPwd = await usersCollection.c_updatePassword(
							req.body.user_id,
							req.body.password
						)

						if (updatedPwd.status) {
							// [DELETE] passwordrecovery //
							const deletedPR = await passwordRecoveriesCollection.c_deleteByUser(
								req.body.user_id
							)

							if (deletedPR.status) {
								res.status(200).send({
									executed: true,
									status: true,
									message: 'Password reset'
								})
							}
						}
						else { res.status(200).send(updatedPwd) }
					}
					else { res.status(200).send(pwdRecovery) }
				}
				else {
					res.status(200).send({
						executed: true,
						status: false,
						message: '/api/users: Invalid params'
					})
				}
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: 'You have not made a request to reset your password'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/users: Error --> ${err}`,
			})
		}
	}
)


/******************* [REPORTS] *******************/
// [CREATE] Report //
router.post(
	'/report',
	Auth.userToken(),
	rateLimiters.reportLimiter,
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.body.reportType) &&
				validator.isAscii(req.body.reportedUser)
			) {
				// [FORMAT] //
				req.body.reportType = req.body.reportType.toLowerCase()

			
				// [EXISTANCE] Do not double save //
				const existance = await userReportsCollection.c_existanceByUserAndReportedUser(
					req.decoded.user_id,
					req.body.reportedUser
				)

				if (existance.status && !existance.existance) {
					// [CREATE] commentReport //
					const userReport = await userReportsCollection.c_create(
						req.decoded.user_id,
						req.body.reportType,
						req.body.reportedUser
					)

					res.status(200).send(userReport)
				}
				else {
					res.status(200).send({
						executed: true,
						status: false,
						message: existance.message,
						existance: existance.existance,
					})
				}
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/users: Invalid params',
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/users: Error --> ${err}`,
			})
		}
	},
)


// [EXPORT] //
module.exports = router