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
// [READ] Decoded //
router.get(
	'/read',
	Auth.userTokenCheck(),
	async (req, res) => {
		const returnedData = await UsersCollection.readDecoded(req)

		res.status(200).send(returnedData)
	}
)


// [READ] Profile Image //
router.get(
	'/read/profile-pic-url/:_id',
	async (req, res) => {
		const returnedData = await UsersCollection.readProfilePic(req)

		res.status(200).send(returnedData)
	}
)


// [UPDATE] Auth Required //
router.post(
	'/update',
	Auth.userTokenCheck(),
	async (req, res) => {
		await UsersCollection.updateDecoded(req)

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