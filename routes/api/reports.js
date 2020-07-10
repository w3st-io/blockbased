/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const Auth = require('../../server-middleware/AuthMiddleware')
const ReportsMiddleware = require('../../server-middleware/ReportsMiddleware')
const ReportsCollection = require('../../server-collections/ReportsCollections')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userTokenCheck(),
	ReportsMiddleware.verifyNonExistance(),
	ReportsCollection.create(),
	async (req, res) => { res.status(201),send() }
)


// [EXPORT] //
module.exports = router