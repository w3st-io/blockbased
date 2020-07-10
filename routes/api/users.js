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
// [READ] //
router.get(
	'/read',
	Auth.userTokenCheck(),
	UsersCollection.readDecoded(),
	async (req, res) => { res.status(200).send(req.retrievedData) }
)


// [READ] Profile Image //
router.get(
	'/read/profile-pic-url/:_id',
	UsersCollection.readProfilePic(),
	async (req, res) => { res.status(200).send(req.retrievedData) }
)


// [UPDATE] Auth Required //
router.post(
	'/update',
	Auth.userTokenCheck(),
	UsersCollection.updateDecoded(),
	async (req, res) => { res.status(201).send() }
)


/******************* [LOGIN/REGISTER] *******************/
// [LOGIN] //
router.post(
	'/login',
	UsersCollection.login(),
	async (req, res) => {
		res.json({ status: 'success', token: res.token }).status(200).send()
	}
)


// [REGISTER] //
router.post(
	'/register',
	UsersCollection.register(),
	async (req, res) => { res.json({ status: 'success' }).status(201).send() }
)


// [EXPORT] //
module.exports = router