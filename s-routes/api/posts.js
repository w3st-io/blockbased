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
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.body.cat_id) &&
				validator.isAscii(req.body.title) &&
				validator.isAscii(req.body.text)
			) {
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
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/posts: Invalid Params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/posts: Error --> ${err}`,
			})
		}
	}
)


// [READ-ALL] Within Cat //
router.get(
	'/read-all/:cat_id/:limit/:page',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.params.cat_id) &&
				Number.isInteger(parseInt(req.params.limit)) &&
				Number.isInteger(parseInt(req.params.page))
			) {
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit

				// [READ-ALL] Posts with cat_id //
				let postsObj = await postsCollection.c_readAll(
					req.params.cat_id,
					limit,
					skip,
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
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/posts: Invalid Params'
				})
			}
		}
		catch (err) {
			res.status.send({
				executed: false,
				status: false,
				message: `/api/posts: Error --> ${err}`
			})
		}
	}
)


// [READ] //
router.get(
	'/read/:post_id',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (mongoose.isValidObjectId(req.params.post_id)) {
				// [READ] Post //
				let postObj = await postsCollection.c_read(req.params.post_id)

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
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: 'Invalid post_id',
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/posts: Error --> ${err}`
			})
		}
	},
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:post_id',
	Auth.userToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (mongoose.isValidObjectId(req.params.post_id)) {
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
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: 'Invalid post _id',
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/posts: Error --> ${err}`
			})
		}
	},
)

/******************* [OTHER-CURD] *******************/
// [READ-ALL-DETAILED] Within Cat with User Details //
router.get(
	'/read-all-detailed/:cat_id/:limit/:page',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.params.cat_id) &&
				Number.isInteger(parseInt(req.params.limit)) &&
				Number.isInteger(parseInt(req.params.page))
			) {
				// [INIT] //
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit

				let postsObj = await postsCollection.c_readAll(
					req.params.cat_id,
					limit,
					skip,
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
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/posts: Invalid Params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/posts: Error --> ${err}`
			})
		}
	}
)

// [READ-DETAILED] With User Details //
router.get(
	'/read-detailed/:post_id',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (mongoose.isValidObjectId(req.params.post_id)) {
				let postObj = await postsCollection.c_read(req.params.post_id)

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
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: 'Invalid post _id',
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/posts: Error --> ${err}`
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
		try {
			// [VALIDATE] //
			if (mongoose.isValidObjectId(req.params.post_id)) {
				const existance = await postLikesCollection.c_existance(
					req.decoded.user_id,
					req.params.post_id
				)

				if (!existance.existance) {
					// [CREATE] postLike //
					const postLikeObj = await postLikesCollection.c_create(
						req.decoded.user_id,
						req.params.post_id
					)

					if (postLikeObj.status) {
						// [UPDATE] likeCount //
						const post = await postsCollection.c_incrementLike(
							req.params.post_id
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
					message: 'Invalid post _id'
				})
			}
		} 
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/posts: Error --> ${err}`
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
		try {
			if (mongoose.isValidObjectId(req.params.post_id)) {
				const existance = await postLikesCollection.c_existance(
					req.decoded.user_id,
					req.params.post_id
				)

				if (existance.existance) {
					// [CREATE] postLike //
					const postLikeObj = await postLikesCollection.c_delete(
						req.decoded.user_id,
						req.params.post_id
					)
					
					if (postLikeObj.status) {
						// [UPDATE] likeCount //
						const post = await postsCollection.c_decrementLike(
							req.params.post_id
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
					message: 'Invalid post_id'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/posts: Error --> ${err}`
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
		try {
			if (mongoose.isValidObjectId(req.params.post_id)) {
				const returned = await postFollowersCollection.c_create(
					req.decoded.user_id,
					req.params.post_id
				)
				
				res.status(200).send(returned)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: 'Invalid post _id',
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/posts: Error --> ${err}`
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
		try {
			if (mongoose.isValidObjectId(req.params.post_id)) {
				const returned = await postFollowersCollection.c_delete(
					req.decoded.user_id,
					req.params.post_id
				)
				
				res.status(200).send(returned)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: 'Invalid post _id'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/posts: Error --> ${err}`
			})
		}
	},
)


/******************* [COUNT] *******************/
router.get(
	'/count/:cat_id',
	async (req, res) => {
		try {
			if (validator.isAscii(req.params.cat_id)) {
				const returned = await postsCollection.c_countAll(req.params.cat_id)

				if (returned.status) { res.status(200).send(returned.count.toString()) }
				else { res.status(200).send(returned.message.toString()) }
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: 'Invalid Params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/posts: Error --> ${err}`
			})
		}
	},
)


// [EXPORT] //
module.exports = router