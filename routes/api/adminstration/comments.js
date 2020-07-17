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
		const returnedData = await CommentsCollection.readAllAll(req)

		res.status(200).send(returnedData)
	}
)


// [READ-ALL] Auth Required - Within a Block //
router.get(
	'/read-all/:block_id/:amount/:skip',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await CommentsCollection.readAll(req)

		res.status(200).send(returnedData)
	}
)


// [READ] Auth Required //
router.get(
	'/read/:_id',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await CommentsCollection.read(req)

		res.status(200).send(returnedData)
	}
)


// [UPDATE] Auth Required //
router.post(
	'/update/:_id',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await CommentsCollection.update(req)

		res.status(201).send(returnedData)
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.adminToken(),
	async (req, res) => {
		await CommentsCollection.delete(req)
		res.sendStatus(200)
	}
)


// [EXPORT] //
module.exports = router