/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION BLOCK ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const aBlocksCollection = require('../../../server-collections/administration/blocksCollection')
const blocksCollection = require('../../../server-collections/blocksCollection')
const blockLikesCollection = require('../../../server-collections/blockLikesCollection')
const Auth = require('../../../server-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ-ALL-ALL] Auth Required //
router.get(
	'/read-all-all/:amount/:skip',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await aBlocksCollection.c_readAllAll(
			req.params.skip,
			req.params.amount
		)

		res.status(200).send(returnedData)
	}
)


// [READ-ALL] Auth Required - Within a Cat //
router.get(
	'/read-all/:cat_id/:amount/:skip',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await blocksCollection.c_readAll(
			req.params.cat_id,
			req.params.skip,
			req.params.amount
		)
		
		res.status(200).send(returnedData)
	}
)


// [READ] Auth Required - Single Block Details //
router.get(
	'/read/:_id',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await blocksCollection.c_read(req.params._id)

		res.status(200).send(returnedData)
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.adminToken(),
	async (req, res) => {
		aBlocksCollection.c_delete(req.params._id)
		blockLikesCollection.c_deleteAll(req.params._id)

		res.sendStatus(200)
	}
)


// [EXPORT] //
module.exports = router