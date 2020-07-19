/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% USER ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const UsersCollection = require('../../server-collections/UsersCollection')
const Auth = require('../../server-middleware/AuthMiddleware')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/
// [READ] Auth Required - Decoded //
router.get(
	'/read',
	Auth.userToken(),
	async (req, res) => {
		const user_id = req.decoded._id

		const returnedData = await UsersCollection.read(user_id)

		res.status(200).send(returnedData)
	}
)


// [READ] Params //
router.get(
	'/read/:_id',
	async (req, res) => {
		const user_id = req.params._id

		const returnedData = await UsersCollection.read(user_id)

		res.status(200).send(returnedData)
	}
)


// [UPDATE] Auth Required //
router.post(
	'/update',
	Auth.userToken(),
	async (req, res) => {
		const user_id = req.decoded._id
		const img_url = req.body.img_url

		await UsersCollection.update(user_id, img_url)

		res.status(201).send()
	}
)


/******************* [LOGIN/REGISTER] *******************/
// [LOGIN] //
router.post(
	'/login',
	async (req, res) => {
		const returnedData = await UsersCollection.login(req)

		res.status(200).send(returnedData)
	}
)


// [REGISTER] //
router.post(
	'/register',
	async (req, res) => {
		const returnedData = await UsersCollection.register(req)

		res.status(201).send(returnedData)
	}
)


// [EXPORT] //
module.exports = router