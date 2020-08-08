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
const CommentReportsCollection = require('../../../server-collections/CommentReportsCollection')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ-ALL] Auth Required //
router.get(
	'/read-all',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await CommentReportsCollection.c_readAll()

		res.status(200).send(returnedData)
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await CommentReportsCollection.c_delete(req.params._id)
		
		res.status(200).send(returnedData)
	}
)


// [EXPORT] //
module.exports = router