/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% USER ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const rateLimiters = require('../../rate-limiters')
const usersCollection = require('../../server-collections/usersCollection')
const verificationCodesCollection = require('../../server-collections/verificationCodesCollection')
const Auth = require('../../server-middleware/Auth')
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
		const returned = await usersCollection.c_read(req.params._id)

		res.status(200).send(returned)
	}
)


// [UPDATE] Auth Required //
router.post(
	'/update',
	Auth.userToken(),
	async (req, res) => {
		const returned = await usersCollection.c_update(
			req.decoded._id,
			req.body.img_url
		)

		res.status(201).send(returned)
	}
)


/******************* [LOGIN/REGISTER] *******************/
// [LOGIN] //
router.post(
	'/login',
	async (req, res) => {
		const returned = await usersCollection.c_login(
			req.body.email,
			req.body.password
		)

		res.status(200).send(returned)
	}
)


// [REGISTER] //
router.post(
	'/register',
	rateLimiters.registrationLimiter,
	async (req, res) => {
		let returned = ''
		let returned2 = ''

		// [CREATE] Register Account //
		try { returned = await usersCollection.c_register(req) }
		catch (e) {
			return {
				status: false,
				message: `users: Caught Error --> ${e}`
			}
		}

		// [CREATE] Verification Code //
		try {
			returned2 = await verificationCodesCollection.c_create(
				returned.createdUser._id
			)
		}
		catch (e) {
			return {
				status: false,
				message: `users: Caught Error --> ${e}`
			}
		}

		// [MAIL] Verification Email //
		mailerUtil.sendVerificationMail(
			returned.createdUser.email,
			returned.createdUser._id,
			returned2.createdVerificationCode.verificationCode
		)

		res.status(201).send(returned)
	}
)


/******************* [USER-VERIFICATION] *******************/
// [LOGIN] //
router.post(
	'/verify',
	async (req, res) => {
		// [EXISTANCE] //
		const valid = await verificationCodesCollection.c_existance(
			req.body.user_id,
			req.body.verificationCode
		)

		console.log('valid', valid)

		if (valid.status) {
			if (valid.existance) {
				res.status(200).send(valid)
			}
			else { res.status(200).send(valid) }
		}
		else { res.status(200).send(valid) }
	}
)


// [EXPORT] //
module.exports = router