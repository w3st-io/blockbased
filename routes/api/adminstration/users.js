/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION USER ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const Auth = require('../../../server-middleware/Auth')
const UsersCollection = require('../../../server-collections/UsersCollection')
const BanCollection = require('../../../server-collections/BanCollection')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ-ALL] Auth Required //
router.get(
	'/read-all/profile-data',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await UsersCollection.c_readAll()

		res.status(201).send(returnedData)
	}
)


// [READ] Auth Required //
router.get(
	'/read/:_id',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await UsersCollection.c_read(req.params._id)

		res.status(200).send(returnedData)
	}
)


// [UPDATE] Auth Required //
router.post(
	'/update/:_id',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await UsersCollection.c_update(
			req.decoded._id,
			req.body.img_url
		)

		res.status(201).send(returnedData)
	}
)


/******************* [BAN] *******************/
// [UPDATE] Auth Required //
router.post(
	'/ban/:_id',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await BanCollection.c_create(
			req.params._id,
			req.body.hours
		)

		res.status(201).send(returnedData)
	}
)


// [EXPORT] //
module.exports = router