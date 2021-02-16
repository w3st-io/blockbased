// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const rateLimiter = require('../../s-rate-limiters')
const activitiesCollection = require('../../s-collections/activitiesCollection')
const postsCollection = require('../../s-collections/postsCollection')
const postFollowsCollection = require('../../s-collections/postFollowsCollection')
const postLikesCollection = require('../../s-collections/postLikesCollection')
const commentsCollection = require('../../s-collections/commentsCollection')
const Auth = require('../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	rateLimiter.postLimiter,
	Auth.userToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.body.cat_id) &&
				req.body.title &&
				req.body.cleanJSON
			) {
				// [CREATE] Post //
				const post = await postsCollection.c_create(
					req.decoded.user_id,
					req.body.cat_id,
					req.body.title
				)

				if (post.status) {
					// [CREATE] Activity //
					const pActivity = await activitiesCollection.c_create({
						user_id: req.decoded.user_id,
						type: 'post',
						post_id: post.createdPost._id,
						created_user_id: undefined,
						created_post_id: post.createdPost._id,
						created_comment_id: undefined,
					})

					if (pActivity.status) {
						// [CREATE] Comment //
						const comment = await commentsCollection.c_create({
							user_id: req.decoded.user_id,
							post_id: post.createdPost._id,
							cleanJSON: req.body.cleanJSON,
						})

						if (comment.status) {
							// [CREATE] Activity //
							const cActivity = await activitiesCollection.c_create({
								user_id: req.decoded.user_id,
								type: 'comment',
								post_id: comment.comment.post,
								created_user_id: undefined,
								created_post_id: undefined,
								created_comment_id: comment.comment._id,
							})
						
							if (cActivity.status) {
								// [SUCCESS] //
								res.status(200).send({
									executed: true,
									status: true,
									post: post,
									comment: comment,
									postActivity: pActivity,
									commentActivity: cActivity,
								})
							}
							else { res.status(200).send(cActivity) }	
						}
						else { res.status(200).send(comment) }						
					}
					else { res.status(200).send(pActivity) }
				}
				else { res.status(200).send(post) }
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/posts/create: Invalid Params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/posts/create: Error --> ${err}`,
			})
		}
	}
)


/******************* [LIKE-SYSTEM] *******************/
// [LIKE] Auth Required //
router.post(
	'/like',
	rateLimiter.likeLimiter,
	Auth.userToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.body.post_id) &&
				validator.isAscii(req.body.postUser_id)
			) {
				// [EXISTANCE] postLike //
				const existance = await postLikesCollection.c_existance(
					req.decoded.user_id,
					req.body.post_id,
				)

				if (!existance.existance) {
					// [CREATE] postLike //
					const postLikeObj = await postLikesCollection.c_create(
						req.decoded.user_id,
						req.body.post_id,
						req.body.postUser_id
					)

					if (postLikeObj.status) {
						// [UPDATE] likeCount //
						const post = await postsCollection.c_incrementLike(
							req.body.post_id
						)

						res.status(200).send({
							executed: true,
							status: true,
							postLike: postLikeObj,
							post: post
						})
					}
					else { res.send(200).send(postLikeObj) }
				}
				else { res.status(200).send({
					executed: true,
					status: false,
					message: existance.message
				}) }
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/posts/like: Invalid post _id'
				})
			}
		} 
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/posts/like: Error --> ${err}`
			})
		}
	},
)


// [UNLIKE] Auth Required //
router.post(
	'/unlike',
	rateLimiter.likeLimiter,
	Auth.userToken(),
	async (req, res) => {
		try {
			if (validator.isAscii(req.body.post_id)) {
				const existance = await postLikesCollection.c_existance(
					req.decoded.user_id,
					req.body.post_id
				)

				if (existance.existance) {
					// [CREATE] postLike //
					const postLikeObj = await postLikesCollection.c_deleteByUserAndPost(
						req.decoded.user_id,
						req.body.post_id
					)
					
					if (postLikeObj.status) {
						// [UPDATE] likeCount //
						const post = await postsCollection.c_decrementLike(
							req.body.post_id
						)

						res.status(200).send({
							executed: true,
							status: true,
							postLike: postLikeObj,
							post: post
						})
					}
					else { res.send(200).send(postLikeObj) }
				}
				else { res.status(200).send(existance) }
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/posts/unlike: Invalid post_id'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/posts/unlike:: Error --> ${err}`
			})
		}
	},
)


/******************* [FOLLOW SYSTEM] *******************/
// [FOLLOW] Auth Required //
router.post(
	'/follow',
	rateLimiter.followLimiter,
	Auth.userToken(),
	async (req, res) => {
		try {
			if (validator.isAscii(req.body.post_id)) {
				const returned = await postFollowsCollection.c_create(
					req.decoded.user_id,
					req.body.post_id
				)
				
				res.status(200).send(returned)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/posts/follow: Invalid post _id',
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/posts/follow: Error --> ${err}`
			})
		}
	},
)


// [UNFOLLOW] Auth Required //
router.post(
	'/unfollow',
	rateLimiter.followLimiter,
	Auth.userToken(),
	async (req, res) => {
		try {
			if (validator.isAscii(req.body.post_id)) {
				const pFObj = await postFollowsCollection.c_deleteByUserAndPost(
					req.decoded.user_id,
					req.body.post_id
				)
				
				res.status(200).send(pFObj)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/posts/unfollow: Invalid post _id',
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/posts/unfollow: Error --> ${err}`
			})
		}
	},
)


// [EXPORT] //
module.exports = router