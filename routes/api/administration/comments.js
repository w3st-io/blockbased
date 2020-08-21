/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION COMMENT ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const aCommentsCollection = require('../../../server-collections/administration/commentsCollection')
const commentsCollection = require('../../../server-collections/commentsCollection')
const commentLikesCollection = require('../../../server-collections/commentLikesCollection')
const notificationsCollection = require('../../../server-collections/notificationsCollection')
const Auth = require('../../../server-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ-ALL-ALL] //
router.get(
	'/read-all-all/:amount/:skip',
	Auth.adminToken(),
	async (req, res) => {
		const returned = await commentsCollection.c_readAllAll(
			req.params.skip,
			req.params.amount
		)

		res.status(200).send(returned)
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.adminToken(),
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params._id)) {
			const returned = await aCommentsCollection.c_delete(req.params._id)
			const returned2 = await commentLikesCollection.c_deleteAll(req.params._id)
			const returned3 = await notificationsCollection.c_deleteAll(req.params._id)

			res.status(200).send({
				status: true,
				deletedStuff: [returned, returned2, returned3]
			})
		}
		else {
			res.status(200).send({
				status: false,
				message: 'a comments: Invalid _id'
			})
		}
	}
)


// [EXPORT] //
module.exports = router