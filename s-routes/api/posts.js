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
					req.decoded.user_id,
					req.body.cat_id,
					req.body.title
				)

				if (post.status) {
					const comment = await commentsCollection.c_create(
						req.decoded.user_id,
						post.createdPost._id,
						req.body.text
					)
		
					res.status(200).send({
						executed: true,
						status: true,
						post: post,
						comment: comment
					})
				}
				else { res.status(200).send(post) }
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
			try {
				let postsObj

				// [READ-ALL] Posts with cat_id //
				postObj = await postsCollection.c_readAll(
					req.params.cat_id,
					parseInt(req.params.skip),
					parseInt(req.params.limit),
				)

				if (postsObj.status) {
					// For Each Post in Posts //
					for (let i = 0; i < postsObj.posts.length; i++) {
						// [COUNT] Likes //
						postsObj.posts[i].likeCount = (
							await postLikesCollection.c_countAll(postsObj.posts[i]._id)
						).count
						
						// [COUNT] Follows //
						postsObj.posts[i].followersCount = (
							await postFollowersCollection.c_countAll(postsObj.posts[i]._id)
						).count
			
						
						// [COUNT] Comment //
						postsObj.posts[i].commentCount = (
							await commentsCollection.c_countAll(postsObj.posts[i]._id)
						).count
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


// [READ] //
router.get(
	'/read/:post_id',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		// [VALIDATE] //
		if (mongoose.isValidObjectId(req.params.post_id)) {
			let postObj

			try {
				// [READ] Post //
				postObj = await postsCollection.c_read(req.params.post_id)

				if (postObj.status) {
					// [COUNT] Likes //
					postObj.post.likeCount = (
						await postLikesCollection.c_countAll(postObj.post._id)
					).count
		
					// [COUNT] Follows //
					postObj.post.followersCount = (
						await postFollowersCollection.c_countAll(postObj.post._id)
					).count
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
	'/delete/:post_id',
	Auth.userToken(),
	async (req, res) => {
		// [VALIDATE] //
		if (mongoose.isValidObjectId(req.params.post_id)) {
			try {
				const ownership = await postsCollection.c_ownership(
					req.params.post_id,
					req.decoded.user_id,
				)
				
				if (ownership.status && ownership.ownership) {
					// [DELETE] //
					const posts = await postsCollection.c_delete(req.params.post_id)
					const postLikes = await postLikesCollection.c_deleteAll(
						req.params.post_id
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
// [READ-ALL-DETAILED] Within Cat with User Details //
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
					// [COUNT] Posts //
					postsObj.postCount = (
						await postsCollection.c_countAll(req.params.cat_id)
					).count
					
					// [COUNT] Calculate Pages //
					postsObj.pageCount = Math.ceil(postsCount.count / req.params.limit)

					// For Each Post in Posts //
					for (let i = 0; i < postsObj.posts.length; i++) {
						// [COUNT] Likes //
						postsObj.posts[i].likeCount = (
							await postLikesCollection.c_countAll(postsObj.posts[i]._id)
						).count
						
						// [COUNT] Follows //
						postsObj.posts[i].followersCount = (
							await postFollowersCollection.c_countAll(postsObj.posts[i]._id)
						).count
			
						
						// [COUNT] Comments //
						postsObj.posts[i].commentCount = (
							await commentsCollection.c_countAll(postsObj.posts[i]._id)
						).count

						// [USER-LOGGED] //
						if (req.decoded) {
							// [LIKED-STATUS] //
							postsObj.posts[i].liked = (
								await postLikesCollection.c_existance(
									req.decoded.user_id,
									postsObj.posts[i]._id
								)
							).existance
			
							// [FOLLOW-STATUS] //
							postsObj.posts[i].followed = (
								await postFollowersCollection.c_existance(
									req.decoded.user_id,
									postsObj.posts[i]._id
								)
							).existance
						}
					}
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

// [READ-DETAILED] With User Details //
router.get(
	'/read-detailed/:post_id',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		// [VALIDATE] //
		if (mongoose.isValidObjectId(req.params.post_id)) {
			let postObj

			try {
				postObj = await postsCollection.c_read(req.params.post_id)

				if (postObj.status) {
					// [COUNT] Likes //
					postObj.post.likeCount = (
						await postLikesCollection.c_countAll(postObj.post._id)
					).count
		
					// [COUNT] Follows //
					postObj.post.followersCount = (
						await postFollowersCollection.c_countAll(postObj.post._id)
					).count
	
					// [USER-LOGGED] //
					if (req.decoded) {
						// [LIKED-STATUS] //
						postObj.post.liked = (
							await postLikesCollection.c_existance(
								req.decoded.user_id,
								postObj.post._id
							)
						).existance
		
						// [FOLLOWED-STATUS] //
						postObj.post.followed = (
							await postFollowersCollection.c_existance(
								req.decoded.user_id,
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

/******************* [LIKE-SYSTEM] *******************/
// [LIKE] Auth Required //
router.post(
	'/like/:post_id',
	Auth.userToken(),
	rateLimiter.likeLimiter,
	async (req, res) => {
		// [VALIDATE] //
		if (mongoose.isValidObjectId(req.params.post_id)) {
			try {
				const existance = await postLikesCollection.c_existance(
					req.decoded.user_id,
					req.params.post_id
				)

				if (!existance.existance) {
					// [CREATE] postLike //
					const returned = await postLikesCollection.c_create(
						req.decoded.user_id,
						req.params.post_id
					)
		
					if (returned.status) {
						// [UPDATE] likeCount //
						const returned2 = await postsCollection.c_incrementLike(
							req.params.post_id
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
	'/unlike/:post_id',
	rateLimiter.likeLimiter,
	Auth.userToken(),
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params.post_id)) {
			try {
				const existance = await postLikesCollection.c_existance(
					req.decoded.user_id,
					req.params.post_id
				)

				if (existance.existance) {
					// [CREATE] postLike //
					const returned = await postLikesCollection.c_delete(
						req.decoded.user_id,
						req.params.post_id
					)
					
					if (returned.status) {
						// [UPDATE] likeCount //
						const returned2 = await postsCollection.c_decrementLike(
							req.params.post_id
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
				message: 'Invalid post_id'
			})
		}
	},
)


/******************* [FOLLOW SYSTEM] *******************/
// [FOLLOW] Auth Required //
router.post(
	'/follow/:post_id',
	Auth.userToken(),
	rateLimiter.followLimiter,
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params.post_id)) {
			try {
				const returned = await postFollowersCollection.c_create(
					req.decoded.user_id,
					req.params.post_id
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
	'/unfollow/:post_id',
	rateLimiter.followLimiter,
	Auth.userToken(),
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params.post_id)) {
			try {
				const returned = await postFollowersCollection.c_delete(
					req.decoded.user_id,
					req.params.post_id
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