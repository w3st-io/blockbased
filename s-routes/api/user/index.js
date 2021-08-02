// [REQUIRE] //
const bcrypt = require('bcryptjs')
const cors = require('cors')
const express = require('express')
const jwt = require('jsonwebtoken')
const validator = require('validator')


// [REQUIRE] Personal //
const config = require('../../../s-config')
const rateLimiters = require('../../../s-rate-limiters')
const activitiesCollection = require('../../../s-collections/activitiesCollection')
const passwordRecoveriesCollection = require('../../../s-collections/passwordRecoveriesCollection')
const userReportsCollection = require('../../../s-collections/userReportsCollection')
const usersCollection = require('../../../s-collections/usersCollection')
const verificationCodesCollection = require('../../../s-collections/verificationCodesCollection')
const Auth = require('../../../s-middleware/Auth')
const mailerUtil = require('../../../s-utils/mailerUtil')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [UPDATE] Auth Required //
router.post(
	'/update',
	Auth.userToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (validator.isAscii(req.body.img_url)) {
				const returned = await usersCollection.c_update({
					user_id: req.user_decoded.user_id,
					img_url: req.body.img_url,
					bio: req.body.bio
				})
		
				res.send(returned)
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/update',
					message: 'Invalid params',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/update',
				message: `Caught Error --> ${err}`,
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
						// [READ] Get user by email //
						const userObj = await usersCollection.c_readByEmail(
							req.body.email
						)

						if (userObj.user) {
							// [VALIDATE-PASSWORD] //
							if (
								bcrypt.compareSync(
									req.body.password,
									userObj.user.password
								)
							) {
								const token = jwt.sign(
									{
										user_id: userObj.user._id,
										email: userObj.user.email,
										username: userObj.user.username,
										first_name: userObj.user.first_name,
										last_name: userObj.user.last_name,
										verified: userObj.user.verified
									},
									config.SECRET_KEY,
									{
										expiresIn: config.NODE_ENV == 'production' ? 7200 : undefined
									}
								)
						
								res.send({
									executed: true,
									status: true,
									message: 'success',
									validation: true,
									token: token,
								})
							}
							else {
								res.send({
									executed: true,
									status: true,
									location: '/api/user/login',
									message: 'Invalid email or password',
									validation: false,
								})
							}
						}
						else {
							res.send({
								executed: true,
								status: true,
								location: '/api/user/login',
								message: 'Invalid email or password',
								validation: false
							})
						}
					}
					else {
						res.send({
							executed: true,
							status: false,
							location: '/api/user/login',
							message: 'Invalid password',
						})
					}
				}
				else {
					res.send({
						executed: true,
						status: false,
						location: '/api/user/login',
						message: 'Invalid email',
					})
				}
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/login',
					message: 'Invalid Params',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/login',
				message: `Caught Error --> ${err}`,
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
				const user = await usersCollection.c_register({
					username: req.body.username,
					email: req.body.email,
					password: req.body.password,
				})

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
					const activity = await activitiesCollection.c_create({
						user_id: user.user._id,
						type: 'user',
						post_id: undefined,
						created_user_id: user.user._id,
						created_post_id: undefined,
						created_comment_id: undefined,
					})

					if (activity.status) {
						res.send({
							executed: true,
							status: true,
							user: user.user,
							created: true,
							activity: activity,
						})
					}
					else { res.send(activity) }
				}
				else { res.send(user) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					message: '/api/user/register: Invalid Params',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				message: `/api/user/register: Error --> ${err}`,
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

				res.send(valid)
			}
			else {
				res.send({
					executed: true,
					status: false,
					message: '/api/user/verify: Invalid params',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				message: `/api/user/verify: Error --> ${err}`,
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

				res.send({
					executed: true,
					status: true,
					message: 'Verification email sent',
				})
			}
			else {
				res.send({
					executed: true,
					status: false,
					message: '/api/user/resend-verification-email: Invalid params',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				message: `/api/user/resend-verification-email: Error --> ${err}`,
			})
		}
	}
)


/******************* [PASSWORD] *******************/
router.post(
	'/change-password',
	Auth.userToken(),
	async (req, res) => {
		try {
			if (
				validator.isAscii(req.body.currentPassword) &&
				validator.isAscii(req.body.password)
			) {
				const userObj = await usersCollection.c_read(
					req.user_decoded.user_id
				)
				
				if (userObj.status) {
					// [VALIDATE-PASSWORD] //
					if (bcrypt.compareSync(req.body.currentPassword, userObj.user.password)) {		
						// [UPDATE] Password //
						const updatedPwd = await usersCollection.c_updatePassword(
							req.user_decoded.user_id,
							req.body.password
						)

						res.send(updatedPwd) 
					}
					else {
						res.send({
							executed: true,
							status: false,
							location: '/api/user/reset-password',
							message: 'Invalid password',
						})
					}
				}
				else {
					res.send(userObj)
				}
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/reset-password',
					message: 'Invalid Params',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				message: '/api/user/reset-password',
				message: `Caught Error --> ${err}`,
			})
		}
	}
)


// Send the email for the password reset
router.post(
	'/request-reset-password',
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
						
						res.send(email)
					}
					else { res.send(passwordRecovery) }
				}
				else { res.send(user) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/request-reset-password',
					message: 'Invalid params',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/request-reset-password',
				message: `Caught Error --> ${err}`,
			})
		}
	}
)


router.post(
	'/reset-password',
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
								res.send({
									executed: true,
									status: true,
									message: 'Password reset'
								})
							}
						}
						else { res.send(updatedPwd) }
					}
					else { res.send(pwdRecovery) }
				}
				else {
					res.send({
						executed: true,
						status: false,
						location: '/api/user/reset-password',
						message: 'Invalid params',
					})
				}
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/reset-password',
					message: 'You have not made a request to reset your password',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/reset-password',
				message: `Error --> ${err}`,
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
					req.user_decoded.user_id,
					req.body.reportedUser
				)

				if (existance.status && !existance.existance) {
					// [CREATE] commentReport //
					const userReport = await userReportsCollection.c_create(
						req.user_decoded.user_id,
						req.body.reportType,
						req.body.reportedUser
					)

					res.send(userReport)
				}
				else {
					res.send({
						executed: true,
						status: false,
						message: existance.message,
						existance: existance.existance,
					})
				}
			}
			else {
				res.send({
					executed: true,
					status: false,
						location: '/api/user/report',
						message: 'Invalid params',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
						location: '/api/user/report',
						message: `Caught Error --> ${err}`,
			})
		}
	},
)


module.exports = router