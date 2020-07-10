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
	Auth.adminCheck(),
	UsersCollection.readAll(),
	async (req, res) => { res.status(201).send(req.retrievedData) }
)


// [READ] Auth Required //
router.get(
	'/read/:_id',
	Auth.adminCheck(),
	UsersCollection.read(),
	async (req, res) => { res.status(200).send(req.retrievedData) }
)


// [UPDATE] Auth Required //
router.post(
	'/update/:_id',
	Auth.adminCheck(),
	UsersCollection.update(),
	async (req, res) => { res.status(201).send() }
)


// [EXPORT] //
module.exports = router