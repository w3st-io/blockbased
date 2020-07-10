/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINSTRATION REPORTS ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const Auth = require('../../../server-middleware/AuthMiddleware')
const ReportsCollection = require('../../../server-collections/ReportsCollections')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRRUD] *******************/
// [READ ALL] Auth Required //
router.get(
	'/read-all',
	Auth.adminCheck(),
	ReportsCollection.readAll(),
	async (req, res) => { res.status(200).send(req.retrievedData) }
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.adminCheck(),
	ReportsCollection.delete(),
	async (req, res) => { res.status(200).send() }
)


// [EXPORT] //
module.exports = router