// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const rateLimiter = require('../../s-rate-limiters')
const activitiesCollection = require('../../s-collections/activitiesCollection')
const postsCollection = require('../../s-collections/postsCollection')
const commentsCollection = require('../../s-collections/commentsCollection')
const commentLikesCollection = require('../../s-collections/commentLikesCollection')
const commentReportsCollection = require('../../s-collections/commentReportsCollection')
const postFollowsCollection = require('../../s-collections/postFollowsCollection')
const preeditedCommentsCollection = require('../../s-collections/preeditedCommentsCollection')
const notificationsCollection = require('../../s-collections/notificationsCollection')
const Auth = require('../../s-middleware/Auth')
const userUtils = require('../../s-utils/userUtils')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userToken(),
	rateLimiter.commentLimiter,
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.body.post_id) &&
				req.body.text &&
				(req.body.replyToComment || req.body.replyToComment === null)
			) {
				const postExistance = await postsCollection.c_existance(req.body.post_id)

				if (postExistance.existance) {
					// [CREATE] Comment //
					const comment = await commentsCollection.c_create(
						req.decoded.user_id,
						req.body.post_id,
						req.body.text,
						req.body.replyToComment,
					)

					if (comment.status) {
						// [COUNT] Comments //
						const commentCount = await commentsCollection.c_countByPost(
							req.body.post_id
						)

						// [READ-ALL] Follows //
						const pFObj = await postFollowsCollection.c_readByPost(
							req.body.post_id
						)
						
						// [CREATE] Notification //
						for (let i = 0; i < pFObj.postFollows.length; i++) {
							if (pFObj.postFollows[i].user != req.decoded.user_id) {
								await notificationsCollection.c_create(
									pFObj.postFollows[i].user,
									comment.comment._id,
									'comment'
								)

								// Get userSocket by user_id //
								const userSocket = userUtils.getUserSocketByUserId(
									pFObj.postFollows[i].user
								)
								
								if (userSocket) {
									// [EMIT] //
									req.app.io.to(userSocket.socket_id).emit(
										'update-notification'
									)
								}
							}
						}

						// [CREATE] Activity //
						const activity = await activitiesCollection.c_create(
							req.decoded.user_id,
							'comment',
							comment.comment.post,
							undefined,
							undefined,
							comment.comment._id
						)

						if (activity.status) {
							/* Send the comment count to know what the last page is */
							res.status(200).send({
								executed: true,
								status: true,
								comment: comment,
								commentCount: commentCount,
							})
						}
						else { res.status(200).send(activity) }
					}
					else { res.status(200).send(comment) }
				}
				else { res.status(200).send(postExistance) }
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/comments: Invalid Params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/comments: Error --> ${err}`,
			})
		}
	}
)


// [UPDATE] Auth Required //
router.post(
	'/update',
	Auth.userToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (validator.isAscii(req.body.comment_id) && req.body.text) {
				// [OWNERSHIP] //
				const ownership = await commentsCollection.c_ownership(
					req.body.comment_id,
					req.decoded.user_id
				)

				if (ownership.status && ownership.ownership) {
					// [CREATE] PreeditedComment //
					const preeditedComment = await preeditedCommentsCollection.c_create(
						req.decoded.user_id,
						req.body.comment_id
					)

					if (preeditedComment.status) {
						// [UPDATE] //
						const updatedComment = await commentsCollection.c_update(
							req.body.comment_id,
							req.decoded.user_id,
							req.body.text
						)
						
						res.status(200).send(updatedComment)
					}
					else { res.status(200).send(preeditedComment) }
				}
				else {
					res.status(200).send({
						executed: true,
						status: false,
						message: ownership.message,
					})
				}
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/comments: Invalid params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/comments: Error --> ${err}`,
			})
		}
	},
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:comment_id',
	Auth.userToken(),
	async (req, res) => {
		try {
			res.sendStatus(200)
			/*
			// [VALIDATE] //
			if (mongoose.isValidObjectId(req.params.comment_id)) {
				// [DELETE] //
				const comment = await commentsCollection.c_deleteByIdAndUser(
					req.params.comment_id,
					req.decoded.user_id,
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

					res.status(200).send({
						executed: true,
						status: true,
						deleted: [comment, commentLikes, notifications, activity],
					})
				}
				else { res.status(200).send(comment) }
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/comments: Invalid comment_id'
				})
			}
			*/
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/comments: Error --> ${err}`,
			})
		}
	},
)


/******************* [LIKE-SYSTEM] *******************/
// [LIKE] Auth Required //
router.post(
	'/like',
	Auth.userToken(),
	rateLimiter.likeLimiter,
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.body.post_id) &&
				validator.isAscii(req.body.comment_id) &&
				validator.isAscii(req.body.commentUser_id)
			) {
				// [EXISTANCE] commentLike //
				const existance = await commentLikesCollection.c_existance(
					req.decoded.user_id,
					req.body.post_id,
				)

				if (!existance.existance) {
					// [CREATE] CommentLike //
					const commentLike = await commentLikesCollection.c_create(
						req.decoded.user_id,
						req.body.post_id,
						req.body.comment_id,
						req.body.commentUser_id
					)

					res.status(200).send(commentLike)
				}
				else {
					res.status(200).send({
						executed: true,
						status: false,
						message: existance.message
					})
				}
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/comments: Invalid params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/comments: Error --> ${err}`,
			})
		}
	},
)


// [UNLIKE] Auth Required //
router.post(
	'/unlike',
	Auth.userToken(),
	rateLimiter.likeLimiter,
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (validator.isAscii(req.body.comment_id)) {
				// [DELETE] CommentLike //
				const commentLike = await commentLikesCollection.c_deleteByUserAndComment(
					req.decoded.user_id,
					req.body.comment_id,
				)
				
				res.status(200).send(commentLike)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/comments: Invalid comment _id'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/comments: Error --> ${err}`,
			})
		}
	},
)


/******************* [REPORTS] *******************/
// [CREATE] Report //
router.post(
	'/report',
	Auth.userToken(),
	rateLimiter.reportLimiter,
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.body.post_id) &&
				validator.isAscii(req.body.comment_id) &&
				validator.isAscii(req.body.reportType)
			) {
				// [FORMAT] //
				req.body.reportType = req.body.reportType.toLowerCase()

				// [READ] comment //
				const commentObj = await commentsCollection.c_read(
					req.decoded.user_id,
					req.body.comment_id
				)

				if (commentObj.status && commentObj.comment) {
					// [EXISTANCE] Do not double save //
					const existance = await commentReportsCollection.c_existanceByUserAndComment(
						req.decoded.user_id,
						commentObj.comment._id
					)

					if (existance.status && !existance.existance) {
						// [CREATE] commentReport //
						const commentReport = await commentReportsCollection.c_create(
							req.decoded.user_id,
							commentObj.comment,
							req.body.post_id,
							req.body.reportType
						)

						res.status(200).send(commentReport)
					}
					else {
						res.status(200).send({
							executed: true,
							status: false,
							message: existance.message,
							existance: existance.existance,
						})
					}
				}
				else {
					res.status(200).send({
						executed: true,
						status: false,
						message: 'Comment doesnt exist.'
					})
				}
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/comments: Invalid params',
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/comments: Error --> ${err}`,
			})
		}
	},
)


// [EXPORT] //
module.exports = router