/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% USER ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const rateLimiters = require('../../s-rate-limiters')
const passwordRecoveriesCollection = require('../../s-collections/passwordRecoveriesCollection')
const usersCollection = require('../../s-collections/usersCollection')
const verificationCodesCollection = require('../../s-collections/verificationCodesCollection')
const Auth = require('../../s-middleware/Auth')
const mailerUtil = require('../../s-utils/mailerUtil')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/
// [READ] Auth Required - Decoded //
router.get(
	'/read',
	Auth.userToken(),
	async (req, res) => {
		try {
			const returned = await usersCollection.c_read(req.decoded.user_id)

			res.status(200).send(returned)
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/comments: Error --> ${err}`,
			})
		}
	}
)


// [READ] Params //
router.get(
	'/read/:user_id',
	async (req, res) => {
		// [VALIDATE] //
		if (mongoose.isValidObjectId(req.params.user_id)) {
			try {
				const returned = await usersCollection.c_read(req.params.user_id)

				res.status(200).send(returned)
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/users: Error --> ${err}`,
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'Invalid user _id'
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
		if (validator.isAscii(req.body.img_url)) {
			try {
				const returned = await usersCollection.c_update(
					req.decoded.user_id,
					req.body.img_url
				)
		
				res.status(200).send(returned)
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/users: Error --> ${err}`,
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'Invalid img_url'
			})
		}
	}
)


/******************* [LOGIN/REGISTER] *******************/
// [LOGIN] //
router.post(
	'/login',
	async (req, res) => {
		if (
			validator.isAscii(req.body.email) &&
			validator.isAscii(req.body.password)
		) {
			try {
				const returned = await usersCollection.c_login(
					req.body.email,
					req.body.password
				)
		
				res.status(200).send(returned)
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/users: Error --> ${err}`,
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'users: Invalid Params'
			})
		}
	}
)


// [REGISTER] //
router.post(
	'/register',
	rateLimiters.registrationLimiter,
	async (req, res) => {
		if (
			validator.isAscii(req.body.username) &&
			validator.isAscii(req.body.email) &&
			validator.isAscii(req.body.password)
		) {
			try {
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
				}

				res.status(200).send(user)
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/users: Error --> ${err}`,
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'users: Invalid Params'
			})
		}
	}
)


/******************* [VERIFICATION] *******************/
router.post(
	'/verify',
	async (req, res) => {
		if (
			mongoose.isValidObjectId(req.body.user_id) &&
			validator.isAscii(req.body.verificationCode)
		) {
			try {
				// [EXISTANCE] //
				const valid = await verificationCodesCollection.c_existance(
					req.body.user_id,
					req.body.verificationCode
				)

				if (valid.status && valid.existance) {
					// [UPDATE] Verify User //
					usersCollection.c_verify(req.body.user_id)
				}

				res.status(200).send(valid)
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/users: Error --> ${err}`,
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'users: Invalid params'
			})
		}
	}
)


/******************* [PASSWORD] *******************/
router.post(
	'/send-password-reset/:email',
	async (req, res) => {
		if (validator.isAscii(req.params.email)) {
			try {
				// [READ] User By the Email //
				const user = await usersCollection.c_getIdByEmail(req.params.email)

				if (user.status) {
					// [CREATE] Password Recovery //
					const passwordRecovery = await passwordRecoveriesCollection.c_create(
						user.user._id
					)
					
					if (passwordRecovery.status && !passwordRecovery.existance) {
						// [SEND-MAIL] //
						const email = await mailerUtil.sendPasswordResetEmail(
							req.params.email,
							user.user._id,
							passwordRecovery.passwordRecovery.verificationCode
						)
						
						res.status(200).send(email)
					}
					else { res.status(200).send(passwordRecovery) }
				}
				else { res.status(200).send(user) }
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/users: Error --> ${err}`,
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'users: Invalid params'
			})
		}
	}
)


router.post(
	'/reset-password/:verificationCode',
	async (req, res) => {
		if (req.params.verificationCode) {
			// [READ] Find password reset with given token //
			const tokenFound = ''

			if (tokenFound.existance) {
				if (req.body.newPassword) {
					// [UPDATE] The password of decoded user_id //
				}
				else {
					res.status(200).send({
						executed: true,
						status: false,
						message: 'users: No password'
					})
				}
			}
			res.status(200).send({
				executed: true,
				status: false,
				message: 'users: Invalid token'
			})
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'users: No token passed'
			})
		}
	}
)


// [EXPORT] //
module.exports = router