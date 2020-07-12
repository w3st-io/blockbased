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


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRRUD] *******************/
// [READ ALL ALL] Auth Required //
router.get(
	'/read-all/:amountPerPage/:skip',
	Auth.adminCheck(),
	async (req, res) => {
		const returnedData = await BlocksCollection.readAllAll(req)

		res.status(200).send(returnedData)
	}
)


// [READ ALL] Auth Required - Within a Cat //
router.get(
	'/read-all/:cat_id/:amountPerPage/:skip',
	Auth.adminCheck(),
	async (req, res) => {
		const returnedData = await BlocksCollection.readAll(req)
		res.status(200).send(returnedData)
	}
)


// [READ] Auth Required - Single Block Details //
router.get(
	'/read/:_id',
	Auth.adminCheck(),
	async (req, res) => {
		const returnedData = await BlocksCollection.read(req)
		res.status(200).send(returnedData)
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.adminCheck(),
	async (req, res) => {
		BlocksCollection.delete(req)
		res.sendStatus(200)
	}
)


// [EXPORT] //
module.exports = router