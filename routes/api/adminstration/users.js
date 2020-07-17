/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION USER ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const Auth = require('../../../server-middleware/AuthMiddleware')
const UsersCollection = require('../../../server-collections/UsersCollection')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/
// [READ-ALL] Auth Required //
router.get(
	'/read-all/profile-data',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await UsersCollection.readAll(req)

		res.status(201).send(returnedData)
	}
)


// [READ] Auth Required //
router.get(
	'/read/:_id',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await UsersCollection.read(req)

		res.status(200).send(returnedData)
	}
)


// [UPDATE] Auth Required //
router.post(
	'/update/:_id',
	Auth.adminToken(),
	async (req, res) => {
		await UsersCollection.update(req)

		res.status(201).send()
	}
)


// [EXPORT] //
module.exports = router