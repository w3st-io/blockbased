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
const rateLimiters = require('../../rate-limiters')
const passwordRecoveriesCollection = require('../../s-collections/passwordRecoveriesCollection')
const usersCollection = require('../../s-collections/usersCollection')
const verificationCodesCollection = require('../../s-collections/verificationCodesCollection')
const Auth = require('../../s-middleware/Auth')
const mailerUtil = require('../../utils/mailerUtil')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/
// [READ] Auth Required - Decoded //
router.get(
	'/read',
	Auth.userToken(),
	async (req, res) => {
		const returned = await usersCollection.c_read(req.decoded._id)

		res.status(200).send(returned)
	}
)


// [READ] Params //
router.get(
	'/read/:_id',
	async (req, res) => {
		// [VALIDATE] //
		if (mongoose.isValidObjectId(req.params._id)) {
			const returned = await usersCollection.c_read(req.params._id)

			res.status(200).send(returned)
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
			const returned = await usersCollection.c_update(
				req.decoded._id,
				req.body.img_url
			)
	
			res.status(201).send(returned)
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
			const returned = await usersCollection.c_login(
				req.body.email,
				req.body.password
			)
	
			res.status(200).send(returned)
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

			res.status(201).send(user)
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
			// [READ] User By the Email //
			const user = await usersCollection.c_getIdByEmail(req.params.email)

			if (user.status) {
				// [CREATE] Password Recovery //
				const passwordRecovery = await passwordRecoveriesCollection.c_create(
					user.user._id
				)
				
				if (passwordRecovery.status && !passwordRecovery.existance) {
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
	'/reset-password',
	async (req, res) => {
		const newPassword = req.body.newPassword
		
		// if token exist //
		if (req.body.token) {
			// decode the token
				// if decoded
					// update the passowrd of decoded user_id
		}
	}
)


// [EXPORT] //
module.exports = router