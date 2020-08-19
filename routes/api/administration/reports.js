/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION REPORTS ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const commentReportsCollection = require('../../../server-collections/commentReportsCollection')
const Auth = require('../../../server-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ-ALL] Auth Required //
router.get(
	'/read-all',
	Auth.adminToken(),
	async (req, res) => {
		const returned = await commentReportsCollection.c_readAll()

		res.status(200).send(returned)
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.adminToken(),
	async (req, res) => {
		const returned = await commentReportsCollection.c_delete(req.params._id)
		
		res.status(200).send(returned)
	}
)


// [EXPORT] //
module.exports = router