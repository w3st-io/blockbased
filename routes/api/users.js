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
const Auth = require('../../server-middleware/Auth')


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
		const returned = await usersCollection.c_register(req)

		res.status(201).send(returned)
	}
)


// [EXPORT] //
module.exports = router