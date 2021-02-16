// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')
const mongoose = require('mongoose')


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
const socketUtil = require('../../s-utils/socketUtil')


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
				req.body.cleanJSON &&
				(req.body.replyToComment_id || req.body.replyToComment_id === null)
			) {
				// [READ] Post //
				const pObj = await postsCollection.c_read(
					req.decoded.user_id,
					req.body.post_id
				)
				
				if (pObj.post) {
					// [CREATE] Comment //
					const cObj = await commentsCollection.c_create(
						req.decoded.user_id,
						req.body.post_id,
						req.body.cleanJSON,
						req.body.replyToComment_id,
					)

					if (cObj.status) {
						// [COUNT] Comments //
						const cCObj = await commentsCollection.c_countByPost(
							req.body.post_id
						)

						// [READ-ALL] Follows //
						const pFObj = await postFollowsCollection.c_readByPost(
							req.body.post_id
						)

						// [NOTIFCATION] Post Followers //
						for (let i = 0; i < pFObj.postFollows.length; i++) {
							if (pFObj.postFollows[i].user != req.decoded.user_id) {
								// [CREATE] Notification Comment //
								await notificationsCollection.c_create(
									pFObj.postFollows[i].user,
									cObj.comment._id,
									'comment'
								)

								// [SOCKET-READ] Get userSocket by user_id //
								const userSocket = socketUtil.getUserSocketByUserId(
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

						// [NOTIFICATION] If Reply to Comment //
						if (cObj.comment.replyToComment) {
							// [READ] Comment  //
							const repliedToComment = await commentsCollection.c_read(
								req.decoded.comment,
								cObj.comment.replyToComment,
							)

							// [CREATE] Notification Reply //
							await notificationsCollection.c_create(
								repliedToComment.comment.user._id,
								cObj.comment._id,
								'reply'
							)

							// [SOCKET-READ] Get userSocket by user_id //
							const userSocket = socketUtil.getUserSocketByUserId(
								repliedToComment.comment.user._id
							)
							
							if (userSocket) {
								// [EMIT] //
								req.app.io.to(userSocket.socket_id).emit(
									'update-notification'
								)
							}
						}

						// [CREATE] Activity //
						await activitiesCollection.c_create({
							user_id: req.decoded.user_id,
							type: 'comment',
							post_id: cObj.comment.post,
							created_user_id: undefined,
							created_post_id: undefined,
							created_comment_id: cObj.comment._id
						})

						res.status(200).send({
							executed: true,
							status: true,
							comment: cObj.comment,
							cCObj: cCObj.count,
						})
					}
					else { res.status(200).send(cObj) }
				}
				else { res.status(200).send(pObj) }
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/comments/create: Invalid Params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/comments/create: Error --> ${err}`,
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
			if (validator.isAscii(req.body.comment_id) && req.body.cleanJSON) {
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
							req.body.cleanJSON,
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
					message: '/api/comments/update: Invalid params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/comments/update: Error --> ${err}`,
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
					message: '/api/comments/delete: Invalid comment_id'
				})
			}
			*/
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/comments/delete: Error --> ${err}`,
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
				const existance = await commentLikesCollection.c_existance({
					user_id: req.decoded.user_id,
					comment_id: req.body.comment_id,
				})

				if (!existance.existance) {
					// [CREATE] CommentLike //
					const commentLike = await commentLikesCollection.c_create({
						user_id: req.decoded.user_id,
						post_id: req.body.post_id,
						comment_id: req.body.comment_id,
						commentUser_id: req.body.commentUser_id
					})

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
					message: '/api/comments/like: Invalid params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/comments/like: Error --> ${err}`,
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
				const commentLike = await commentLikesCollection.c_deleteByUserAndComment({
					user_id: req.decoded.user_id,
					comment_id: req.body.comment_id,
				})
				
				res.status(200).send(commentLike)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/comments/unlike: Invalid comment _id'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/comments/unlike: Error --> ${err}`,
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
						message: '/api/comments/report: Comment doesnt exist.'
					})
				}
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/comments/report: Invalid params',
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/comments/report: Error --> ${err}`,
			})
		}
	},
)


// [EXPORT] //
module.exports = router