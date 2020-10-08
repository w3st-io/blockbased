/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
 * this MUST have nested if's due to error if none
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const rateLimiter = require('../../s-rate-limiters')
const postsCollection = require('../../s-collections/postsCollection')
const postFollowersCollection = require('../../s-collections/postFollowersCollection')
const commentsCollection = require('../../s-collections/commentsCollection')
const commentLikesCollection = require('../../s-collections/commentLikesCollection')
const commentReportsCollection = require('../../s-collections/commentReportsCollection')
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
				req.body.text
			) {
				const postExistance = await postsCollection.c_existance(req.body.post_id)

				if (postExistance.existance) {
					const comment = await commentsCollection.c_create(
						req.decoded.user_id,
						req.body.post_id,
						req.body.text
					)

					if (comment.status) {
						// [READ-ALL] Followers //
						const followers = await postFollowersCollection.c_readAll(
							req.body.post_id
						)

						// [COUNT] Comments //
						const commentCount = await commentsCollection.c_countAll(
							req.body.post_id
						)
						
						// [CREATE] Notification //
						for (let i = 0; i < followers.postFollowers.length; i++) {
							if (followers.postFollowers[i].user != req.decoded.user_id) {
								await notificationsCollection.c_create(
									followers.postFollowers[i].user,
									comment.comment._id,
									'comment'
								)

								// Get userSocket by user_id //
								const userSocket = userUtils.getUserSocketByUserId(
									followers.postFollowers[i].user
								)
								
								if (userSocket) {
									// [EMIT] //
									req.app.io.to(userSocket.socket_id).emit(
										'update-notification'
									)
								}
							}
						}

						/* Send the comment count to know what the last page is */
						res.status(200).send({
							executed: true,
							status: true,
							comment: comment,
							commentCount: commentCount
						})
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


// [READ-ALL] Within Post //
router.get(
	'/read-all/:post_id/:limit/:page',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				mongoose.isValidObjectId(req.params.post_id) &&
				Number.isInteger(parseInt(req.params.limit)) &&
				Number.isInteger(parseInt(req.params.skip))
			) {
				// [INIT] //
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit

				const postExistance = await postsCollection.c_existance(
					req.params.post_id
				)

				if (postExistance.existance) {
					const returned = await commentsCollection.c_readAll(
						req.params.post_id,
						skip,
						limit
					)
					
					if (returned.status) {
						// For Each Post in Posts //
						for (let i = 0; i < returned.comments.length; i++) {
							// Set Like Count //
							const count = await commentLikesCollection.c_countAll(
								returned.comments[i]._id
							)
		
							returned.comments[i].likeCount = count.count
			
							if (req.decoded) {
								// Set Liked Status //
								const liked = await commentLikesCollection.c_existance(
									req.decoded.user_id,
									returned.comments[i]._id
								)
			
								returned.comments[i].liked = liked.existance
							}
						}
					}
				
					res.status(200).send(returned)
				}
				else { res.status(200).send(postExistance) }
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
	}
)


// [READ] //
router.get(
	'/read/:comment_id',
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (mongoose.isValidObjectId(req.params.comment_id)) {
				// [READ] Comment //
				const returned = await commentsCollection.c_read(req.params.comment_id)
			
				if (returned.status) {
					// [COUNT] Likes //
					returned.comment.likeCount = (
						await commentLikesCollection.c_countAll(req.params.comment_id)
					).count
	
					// [USER-LOGGED] //
					if (req.decoded) {
						// [LIKED-STATUS] //
						returned.comment.liked = (
							await commentLikesCollection.c_existance(
								req.decoded.user_id,
								req.params.comment_id
							)
						).existance
					}
				}
	
				res.status(200).send(returned)
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


// [UPDATE] Auth Required //
router.post(
	'/update/:comment_id',
	Auth.userToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				mongoose.isValidObjectId(req.params.comment_id) &&
				req.body.text
			) {
				// [UPDATE] //
				const comment = await commentsCollection.c_update(
					req.params.comment_id,
					req.decoded.user_id,
					req.body.text
				)
				
				res.status(200).send(comment)
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
			// [VALIDATE] //
			if (mongoose.isValidObjectId(req.params.comment_id)) {
				// [DELETE] //
				const comment = await commentsCollection.c_delete(
					req.params.comment_id,
					req.decoded.user_id,
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
					message: '/api/comments: Invalid comment_id'
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


/******************* [LIKE-SYSTEM] *******************/
// [LIKE] Auth Required //
router.post(
	'/like/:comment_id/:post_id',
	Auth.userToken(),
	rateLimiter.likeLimiter,
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				mongoose.isValidObjectId(req.params.comment_id) &&
				mongoose.isValidObjectId(req.params.post_id)
			) {
					// [CREATE] CommentLike //
				const commentLike = await commentLikesCollection.c_create(
					req.decoded.user_id,
					req.params.post_id,
					req.params.comment_id,
				)

				res.status(200).send(commentLike)
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
	'/unlike/:comment_id',
	Auth.userToken(),
	rateLimiter.likeLimiter,
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (mongoose.isValidObjectId(req.params.comment_id)) {
				// [DELETE] CommentLike //
				const commentLike = await commentLikesCollection.c_delete(
					req.decoded.user_id,
					req.params.comment_id,
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
// [CREATE] //
router.post(
	'/report/:comment_id',
	Auth.userToken(),
	rateLimiter.reportLimiter,
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				mongoose.isValidObjectId(req.params.comment_id) &&
				validator.isAscii(req.body.post_id) &&
				validator.isAscii(req.body.reportType)
			) {
				const returned = await commentReportsCollection.c_create(
					req.decoded.user_id,
					req.params.comment_id,
					req.body.post_id,
					req.body.reportType
				)
				
				res.status(200).send(returned)
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