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


/******************* [CRRUD] *******************/
// [READ-ALL] Auth Required //
router.get(
	'/read-all/:amountPerPage/:skip',
	Auth.adminCheck(),
	CommentsCollection.readAllAll(),
	async (req, res) => { res.status(200).send(req.retrievedData) }
)


// [READ-ALL] Auth Required - Within a Block //
router.get(
	'/read-all/:block_id/:amountPerPage/:skip',
	Auth.adminCheck(),
	CommentsCollection.readAll(),
	async (req, res) => { res.status(200).send(req.retrievedData) }
)


// [READ] Auth Required //
router.get(
	'/read/:_id',
	Auth.adminCheck(),
	CommentsCollection.read(),
	async (req, res) => { res.status(200).send(req.retrievedData) }
)


// [UPDATE] Auth Required //
router.post(
	'/update/:_id',
	Auth.adminCheck(),
	CommentsCollection.update(),
	async (req, res) => { res.status(201).send(req.retrievedData) }
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.adminCheck(),
	CommentsCollection.delete(),
	async (req, res) => { res.sendStatus(200) }
)


// [EXPORT] //
module.exports = router