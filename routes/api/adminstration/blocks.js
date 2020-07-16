/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINSTRATION BLOCK ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const Auth = require('../../../server-middleware/AuthMiddleware')
const BlocksCollection = require('../../../server-collections/BlocksCollection')
const BlockLikesCollection = require('../../../server-collections/BlockLikesCollection')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ-ALL ALL] Auth Required //
router.get(
	'/read-all/:amount/:skip',
	Auth.adminCheck(),
	async (req, res) => {
		const returnedData = await BlocksCollection.readAllAll(
			req.params.skip,
			req.params.amount
		)

		res.status(200).send(returnedData)
	}
)


// [READ-ALL] Auth Required - Within a Cat //
router.get(
	'/read-all/:cat_id/:amount/:skip',
	Auth.adminCheck(),
	async (req, res) => {
		const returnedData = await BlocksCollection.readAll(
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
	Auth.adminCheck(),
	async (req, res) => {
		const returnedData = await BlocksCollection.read(req.params._id)

		res.status(200).send(returnedData)
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.adminCheck(),
	async (req, res) => {
		BlocksCollection.delete(req.params._id)
		BlockLikesCollection.deleteAll(req.params._id)

		res.sendStatus(200)
	}
)


// [EXPORT] //
module.exports = router