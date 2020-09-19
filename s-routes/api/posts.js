/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% POST ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const validator = require('validator')
require('dotenv').config()


// [REQUIRE] Personal //
const rateLimiter = require('../../s-rate-limiters')
const postsCollection = require('../../s-collections/postsCollection')
const postFollowersCollection = require('../../s-collections/postFollowersCollection')
const postLikesCollection = require('../../s-collections/postLikesCollection')
const commentsCollection = require('../../s-collections/commentsCollection')
const Auth = require('../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userToken(),
	rateLimiter.postLimiter,
	async (req, res) => {
		// [VALIDATE] //
		if (
			validator.isAscii(req.body.cat_id) &&
			validator.isAscii(req.body.title) &&
			validator.isAscii(req.body.text)
		) {
			try {
				const post = await postsCollection.c_create(
					req.decoded._id,
					req.body.cat_id,
					req.body.title
				)
				const comment = await commentsCollection.c_create(
					req.decoded._id,
					returned.createdPost._id,
					req.body.text
				)
	
				res.status(200).send({
					executed: true,
					status: true,
					post: post,
					comment: comment
				})
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/posts: Error --> ${err}`,
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: '/api/posts: Invalid Params'
			})
		}
	}
)


// [READ-ALL] Within Cat //
router.get(
	'/read-all/:cat_id/:limit/:skip',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		// [VALIDATE] //
		if (
			validator.isAscii(req.params.cat_id) &&
			Number.isInteger(parseInt(req.params.skip)) &&
			Number.isInteger(parseInt(req.params.limit))
		) {
			let postsObj

			try {
				postObj = await postsCollection.c_readAll(
					req.params.cat_id,
					parseInt(req.params.skip),
					parseInt(req.params.limit),
				)

				if (postsObj.status) {
					// [POST-COUNT] //
					postsObj.postCount = (
						await postsCollection.c_countAll(req.params.cat_id)
					).count
					
					// [PAGE-COUNT] //
					postsObj.pageCount = Math.ceil(postsObj.postCount / req.params.limit)
	
					// For Each Post in Posts //
					for (let i = 0; i < postsObj.posts.length; i++) {
						// [LIKE-COUNT] //
						postsObj.posts[i].likeCount = (
							await postLikesCollection.c_countAll(postsObj.posts[i]._id)
						).count
						
						// [FOLLOW-COUNT] //
						postsObj.posts[i].followersCount = (
							await postFollowersCollection.c_countAll(postsObj.posts[i]._id)
						).count
			
						
						// [COMMENT-COUNT] //
						postsObj.posts[i].commentCount = (
							await commentsCollection.c_countAll(postsObj.posts[i]._id)
						).count
	
						// [USER-LOGGED] //
						if (req.decoded) {
							// [LIKED-STATUS] //
							postsObj.posts[i].liked = (
								await postLikesCollection.c_existance(
									req.decoded._id,
									postsObj.posts[i]._id
								)
							).existance
			
							// [FOLLOWED-STATUS] //
							postsObj.posts[i].followed = (
								await postFollowersCollection.c_existance(
									req.decoded._id,
									postsObj.posts[i]._id
								)
							).existance
						}
					}
				}

				res.status.send(postsObj)
			}
			catch (err) {
				res.status.send({
					executed: false,
					status: false,
					message: `/api/posts: Error --> ${err}`
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: '/api/posts: Invalid Params'
			})
		}
	}
)


// [READ] Single Post //
router.get(
	'/read/:_id',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		// [VALIDATE] //
		if (mongoose.isValidObjectId(req.params._id)) {
			let postObj

			try {
				postObj = await postsCollection.c_read(req.params._id)

				if (postObj.status) {
					// [LIKE-COUNT] //
					postObj.post.likeCount = (
						await postLikesCollection.c_countAll(postObj.post._id)
					).count
		
					// [FOLLOW-COUNT] //
					postObj.post.followersCount = (
						await postFollowersCollection.c_countAll(postObj.post._id)
					).count
	
					// [USER-LOGGED] //
					if (req.decoded) {
						// [LIKED-STATUS] //
						postObj.post.liked = (
							await postLikesCollection.c_existance(
								req.decoded._id,
								postObj.post._id
							)
						).existance
		
						// [FOLLOWED-STATUS] //
						postObj.post.followed = (
							await postFollowersCollection.c_existance(
								req.decoded._id,
								postObj.post._id
							)
						).existance
					}
				}

				res.status(200).send(postObj)
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/posts: Error --> ${err}`
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'Invalid post _id',
			})
		}
	},
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.userToken(),
	async (req, res) => {
		// [VALIDATE] //
		if (mongoose.isValidObjectId(req.params._id)) {
			try {
				const ownership = await postsCollection.c_ownership(
					req.params._id,
					req.decoded._id,
				)
				
				if (ownership.status && ownership.ownership) {
					// [DELETE] //
					const posts = await postsCollection.c_delete(req.params._id)
					const postLikes = await postLikesCollection.c_deleteAll(
						req.params._id
					)
	
					res.status(200).send({
						executed: true,
						status: true,
						deleted: [posts, postLikes]
					})
					
				}
				else { res.status(200).send(ownership) }
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/posts: Error --> ${err}`
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'Invalid post _id',
			})
		}
	},
)

/******************* [OTHER-CURD] *******************/
// [READ-ALL] Within Cat //
router.get(
	'/read-all-detailed/:cat_id/:limit/:skip',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		// [VALIDATE] //
		if (
			validator.isAscii(req.params.cat_id) &&
			Number.isInteger(parseInt(req.params.skip)) &&
			Number.isInteger(parseInt(req.params.limit))
		) {
			try {
				let postsObj

				postsObj = await postsCollection.c_readAll(
					req.params.cat_id,
					parseInt(req.params.skip),
					parseInt(req.params.limit),
					req.params.sort,
				)
				
				if (postsObj.status) {
					// For Each Post in Posts //
					for (let i = 0; i < postsObj.posts.length; i++) {
						// [LIKE-COUNT] //
						postsObj.posts[i].likeCount = (
							await postLikesCollection.c_countAll(postsObj.posts[i]._id)
						).count
						
						// [FOLLOW-COUNT] //
						postsObj.posts[i].followersCount = (
							await postFollowersCollection.c_countAll(postsObj.posts[i]._id)
						).count
			
						
						// [COMMENT-COUNT] //
						postsObj.posts[i].commentCount = (
							await commentsCollection.c_countAll(postsObj.posts[i]._id)
						).count

						// If User Token Passed.. //
						if (req.decoded) {
							// [LIKED-STATUS] //
							postsObj.posts[i].liked = (
								await postLikesCollection.c_existance(
									req.decoded._id,
									postsObj.posts[i]._id
								)
							).existance
			
							// [FOLLOW-STATUS] //
							postsObj.posts[i].followed = (
								await postFollowersCollection.c_existance(
									req.decoded._id,
									postsObj.posts[i]._id
								)
							).existance
						}
					}

					// [POST-COUNT] //
					postsObj.postCount = (
						await postsCollection.c_countAll(req.params.cat_id)
					).count
					
					// [PAGE-COUNT] //
					postsObj.pageCount = Math.ceil(postsCount.count / req.params.limit)
				}

				res.status.send(postsObj)
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/posts: Error --> ${err}`
				})
			}
			
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: '/api/posts: Invalid Params'
			})
		}
	}
)

/******************* [LIKE-SYSTEM] *******************/
// [LIKE] Auth Required //
router.post(
	'/like/:_id',
	Auth.userToken(),
	rateLimiter.likeLimiter,
	async (req, res) => {
		// [VALIDATE] //
		if (mongoose.isValidObjectId(req.params._id)) {
			try {
				const existance = await postLikesCollection.c_existance(
					req.decoded._id,
					req.params._id
				)

				if (!existance.existance) {
					// [CREATE] postLike //
					const returned = await postLikesCollection.c_create(
						req.decoded._id,
						req.params._id
					)
		
					if (returned.status) {
						// [UPDATE] likeCount //
						const returned2 = await postsCollection.c_incrementLike(
							req.params._id
						)

						res.status(200).send({
							executed: true,
							status: true,
							postLike: returned,
							post: returned2
						})
					}
					else { res.send(200).send(returned) }
				}
				else { res.status(200).send(existance) }
			} 
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/posts: Error --> ${err}`
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'Invalid post _id'
			})
		}

	},
)


// [UNLIKE] Auth Required //
router.post(
	'/unlike/:_id',
	rateLimiter.likeLimiter,
	Auth.userToken(),
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params._id)) {
			try {
				const existance = await postLikesCollection.c_existance(
					req.decoded._id,
					req.params._id
				)

				if (existance.existance) {
					// [CREATE] postLike //
					const returned = await postLikesCollection.c_delete(
						req.decoded._id,
						req.params._id
					)
					
					if (returned.status) {
						// [UPDATE] likeCount //
						const returned2 = await postsCollection.c_decrementLike(
							req.params._id
						)
						
						res.status(200).send({
							executed: true,
							status: true,
							postLike: returned,
							post: returned2
						})
					}
					else { res.send(200).send(returned) }

				}
				else { res.status(200).send(existance) }
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/posts: Error --> ${err}`
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'Invalid post _id'
			})
		}
	},
)


/******************* [FOLLOW SYSTEM] *******************/
// [FOLLOW] Auth Required //
router.post(
	'/follow/:_id',
	Auth.userToken(),
	rateLimiter.followLimiter,
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params._id)) {
			try {
				const returned = await postFollowersCollection.c_create(
					req.decoded._id,
					req.params._id
				)
				
				res.status(200).send(returned)
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/posts: Error --> ${err}`
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'Invalid post _id',
			})
		}
	},
)


// [UNFOLLOW] Auth Required //
router.post(
	'/unfollow/:_id',
	rateLimiter.followLimiter,
	Auth.userToken(),
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params._id)) {
			try {
				const returned = await postFollowersCollection.c_delete(
					req.decoded._id,
					req.params._id
				)
				
				res.status(200).send(returned)
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/posts: Error --> ${err}`
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'Invalid post _id'
			})
		}
	},
)


/******************* [COUNT] *******************/
router.get(
	'/count/:cat_id',
	async (req, res) => {
		if (validator.isAscii(req.params.cat_id)) {
			try {
				const returned = await postsCollection.c_countAll(req.params.cat_id)

				if (returned.status) { res.status(200).send(returned.count.toString()) }
				else { res.status(200).send(returned.message.toString()) }
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/posts: Error --> ${err}`
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'Invalid Params'
			})
		}
	},
)


// [EXPORT] //
module.exports = router