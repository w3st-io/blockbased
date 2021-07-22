// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const activitiesCollection = require('../../../s-collections/activitiesCollection')
const commentsCollection = require('../../../s-collections/commentsCollection')
const commentLikesCollection = require('../../../s-collections/commentLikesCollection')
const notificationsCollection = require('../../../s-collections/notificationsCollection')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [DELETE] Auth Required //
router.delete(
	'/delete/:comment_id',
	Auth.adminToken(),
	async (req, res) => {
		try {
			// [VALDIATE] //
			if (validator.isAscii(req.params.comment_id)) {
				// [DELETE] Comment //
				const comment = await commentsCollection.c_delete(
					req.params.comment_id
				)

				if (comment.status) {
					// [DELETE] CommentLike //
					const commentLikes = await commentLikesCollection.c_deleteByComment(
						req.params.comment_id
					)

					// [DELETE] Notifications //
					const notifications = await notificationsCollection.c_deleteByComment(
						req.params.comment_id
					)

					// [DELETE] Activity //
					const activity = await activitiesCollection.c_deleteCommentActivity(
						req.params.comment_id
					)
	
					res.send({
						executed: true,
						status: true,
						deleted: [comment, commentLikes, notifications, activity],
					})
				}
				else { res.send(comment) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/admin/comments/delete',
					message: 'Error --> Invalid comment_id'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
					location: '/api/admin/comments/delete',
					message: `Caught Error --> ${err}`,
			})
		}
	}
)


module.exports = router