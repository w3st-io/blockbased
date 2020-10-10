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
const commentsCollection = require('../../../s-collections/commentsCollection')
const commentLikesCollection = require('../../../s-collections/commentLikesCollection')
const notificationsCollection = require('../../../s-collections/notificationsCollection')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ-ALL-ALL] //
router.get(
	'/read-all-all/:limit/:page',
	Auth.adminToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				Number.isInteger(parseInt(req.params.limit)) &&
				Number.isInteger(parseInt(req.params.page))
			) {
				// [INIT] //
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit

				const returned = await commentsCollection.c_readAllAll(limit, skip)
					
				res.status(200).send(returned)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/administration/comments: Invalid params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/administration/comments: Error --> ${err}`,
			})
		}
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:comment_id',
	Auth.adminToken(),
	async (req, res) => {
		try {
			// [VALDIATE] //
			if (mongoose.isValidObjectId(req.params.comment_id)) {
				// [DELETE] //
				const comment = await commentsCollection.c_adminDelete(
					req.params.comment_id
				)

				if (comment.status) {
					// [DELETE] CommentLike //
					const commentLikes = await commentLikesCollection.c_deleteAll(
						req.params.comment_id
					)

					// [DELETE] Notifications //
					const notifications = await notificationsCollection.c_deleteAll(
						req.params.comment_id
					)
	
					res.status(200).send({
						executed: true,
						status: true,
						deleted: [comment, commentLikes, notifications],
					})
				}
				else { res.status(200).send(comment) }
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/administration/comments: Invalid comment_id'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/administration/comments: Error --> ${err}`,
			})
		}
	}
)


// [EXPORT] //
module.exports = router