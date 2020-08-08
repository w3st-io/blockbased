/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION COMMENT ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const Auth = require('../../../server-middleware/AuthMiddleware')
const CommentsCollection = require('../../../server-collections/CommentsCollection')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ-ALL-ALL] //
router.get(
	'/read-all-all/:amount/:skip',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await CommentsCollection.c_readAllAll(
			req.params.skip,
			req.params.amount
		)

		res.status(200).send(returnedData)
	}
)


// [READ-ALL] Auth Required - Within a Block //
router.get(
	'/read-all/:block_id/:amount/:skip',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await CommentsCollection.c_readAll(
			req.params.block_id,
			req.params.skip,
			req.params.amount
		)

		res.status(200).send(returnedData)
	}
)


// [READ] Auth Required //
router.get(
	'/read/:_id',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await CommentsCollection.c_read(req.params._id)

		res.status(200).send(returnedData)
	}
)


// [UPDATE] Auth Required //
router.post(
	'/update/:_id',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await CommentsCollection.c_update(
			req.params._id,
			req.body.text
		)

		res.status(201).send(returnedData)
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await CommentsCollection.c_delete(
			req.decoded._id,
			req.params._id
		)
		res.status(200).send(returnedData)
	}
)


// [EXPORT] //
module.exports = router