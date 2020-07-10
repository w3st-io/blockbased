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
	BlocksCollection.readAllAll(),
	async (req, res) => { res.status(200).send(req.retrievedData) }
)


// [READ ALL] Auth Required - Within a Cat //
router.get(
	'/read-all/:cat_id/:amountPerPage/:skip',
	Auth.adminCheck(),
	BlocksCollection.readAll(),
	async (req, res) => { res.status(200).send(req.retrievedData) }
)


// [READ] Auth Required - Single Block Details //
router.get(
	'/read/:_id',
	Auth.adminCheck(),
	BlocksCollection.read(),
	async (req, res) => { res.status(200).send(req.retrievedData) }
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.adminCheck(),
	BlocksCollection.delete(),
	async (req, res) => { res.sendStatus(200) }
)


// [EXPORT] //
module.exports = router