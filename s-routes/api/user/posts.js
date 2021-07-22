// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const rateLimiter = require('../../../s-rate-limiters')
const activitiesCollection = require('../../../s-collections/activitiesCollection')
const postsCollection = require('../../../s-collections/postsCollection')
const postFollowsCollection = require('../../../s-collections/postFollowsCollection')
const postLikesCollection = require('../../../s-collections/postLikesCollection')
const commentsCollection = require('../../../s-collections/commentsCollection')
const Auth = require('../../../s-middleware/Auth')


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
					req.user_decoded.user_id,
					req.body.cat_id,
					req.body.title
				)

				if (post.status) {
					// [CREATE] Activity //
					const pActivity = await activitiesCollection.c_create({
						user_id: req.user_decoded.user_id,
						type: 'post',
						post_id: post.createdPost._id,
						created_user_id: undefined,
						created_post_id: post.createdPost._id,
						created_comment_id: undefined,
					})

					if (pActivity.status) {
						// [CREATE] Comment //
						const comment = await commentsCollection.c_create({
							user_id: req.user_decoded.user_id,
							post_id: post.createdPost._id,
							cleanJSON: req.body.cleanJSON,
						})

						if (comment.status) {
							// [CREATE] Activity //
							const cActivity = await activitiesCollection.c_create({
								user_id: req.user_decoded.user_id,
								type: 'comment',
								post_id: comment.comment.post,
								created_user_id: undefined,
								created_post_id: undefined,
								created_comment_id: comment.comment._id,
							})
						
							if (cActivity.status) {
								// [SUCCESS] //
								res.send({
									executed: true,
									status: true,
									post: post,
									comment: comment,
									postActivity: pActivity,
									commentActivity: cActivity,
								})
							}
							else { res.send(cActivity) }	
						}
						else { res.send(comment) }						
					}
					else { res.send(pActivity) }
				}
				else { res.send(post) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/posts/create',
					message: 'Invalid Params'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/posts/create',
				message: `Caught Error --> ${err}`,
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
					req.user_decoded.user_id,
					req.body.post_id,
				)

				if (!existance.existance) {
					// [CREATE] postLike //
					const postLikeObj = await postLikesCollection.c_create(
						req.user_decoded.user_id,
						req.body.post_id,
						req.body.postUser_id
					)

					if (postLikeObj.status) {
						// [UPDATE] likeCount //
						const post = await postsCollection.c_incrementLike(
							req.body.post_id
						)

						res.send({
							executed: true,
							status: true,
							postLike: postLikeObj,
							post: post
						})
					}
					else { res.send(200).send(postLikeObj) }
				}
				else { res.send({
					executed: true,
					status: false,
					message: existance.message
				}) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/posts/like',
					message: 'Invalid post _id'
				})
			}
		} 
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/posts/like',
				message: `Caught Error --> ${err}`
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
					req.user_decoded.user_id,
					req.body.post_id
				)

				if (existance.existance) {
					// [CREATE] postLike //
					const postLikeObj = await postLikesCollection.c_deleteByUserAndPost(
						req.user_decoded.user_id,
						req.body.post_id
					)
					
					if (postLikeObj.status) {
						// [UPDATE] likeCount //
						const post = await postsCollection.c_decrementLike(
							req.body.post_id
						)

						res.send({
							executed: true,
							status: true,
							postLike: postLikeObj,
							post: post
						})
					}
					else { res.send(200).send(postLikeObj) }
				}
				else { res.send(existance) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/posts/unlike',
					message: 'Invalid post_id',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/posts/unlike',
				message: `Caught Error --> ${err}`,
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
					req.user_decoded.user_id,
					req.body.post_id
				)
				
				res.send(returned)
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/posts/follow',
					message: 'Invalid post _id',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/posts/follow',
				message: `Caught Error --> ${err}`
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
					req.user_decoded.user_id,
					req.body.post_id
				)
				
				res.send(pFObj)
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/posts/unfollow',
					message: 'Invalid post _id',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/posts/unfollow',
				message: `Caught Error --> ${err}`
			})
		}
	},
)


module.exports = router