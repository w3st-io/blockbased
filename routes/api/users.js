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
		let user = ''
		let vCode = ''

		// [CREATE] Register Account //
		try { user = await usersCollection.c_register(req) }
		catch (err) {
			res.status(201).send({
				executed: false,
				status: false,
				message: `users: Error --> ${err}`
			})
		}

		if (user.status && user.created) {
			// [CREATE] Verification Code //
			try {
				vCode = await verificationCodesCollection.c_create(user.createdUser._id)
			}
			catch (err) {
				res.status(201).send({
					executed: false,
					status: false,
					message: `users: Error --> ${err}`
				})
			}

			// [MAIL] Verification Email //
			mailerUtil.sendVerificationMail(
				user.createdUser.email,
				user.createdUser._id,
				vCode.createdVerificationCode.verificationCode
			)
		}

		res.status(201).send(user)
	}
)


/******************* [VERIFICATION] *******************/
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
				// [UPDATE] Verify User //
				usersCollection.c_verify(req.body.user_id)

				res.status(200).send(valid)
			}
			else { res.status(200).send(valid) }
		}
		else { res.status(200).send(valid) }
	}
)


// [EXPORT] //
module.exports = router