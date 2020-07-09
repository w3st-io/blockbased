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
	UsersCollection.read(),
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
	UsersCollection.update(),
	async (req, res) => { res.status(201).send() }
)


/******************* [USER LOGIN/REGISTER] *******************/
// [LOGIN] //
router.post(
	'/login',
	UsersCollection.login(),
)


// [REGISTER] //
router.post(
	'/register',
	UsersCollection.register()
)


// [EXPORT] //
module.exports = router