/**
 * %%%%%%%%%%%%%%%%%%%
 * %%% POST ROUTES %%%
 * %%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
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
				// [CREATE] Post //
				const post = await postsCollection.c_create(
					req.decoded.user_id,
					req.body.cat_id,
					req.body.title
				)

				if (post.status) {
					// [CREATE] Activity //
					const pActivity = await activitiesCollection.c_create(
						'post',
						req.decoded.user_id,
						post.createdPost._id,
						undefined,
						post.createdPost._id,
						undefined,
					)

					if (pActivity.status) {
						// [CREATE] Comment //
						const comment = await commentsCollection.c_create(
							req.decoded.user_id,
							post.createdPost._id,
							req.body.text
						)

						if (comment.status) {
							// [CREATE] Activity //
							const cActivity = await activitiesCollection.c_create(
								'comment',
								req.decoded.user_id,
								comment.comment.post,
								undefined,
								undefined,
								comment.comment._id,
							)
						
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


// [READ-ALL-ALL] Auth Required //
router.get(
	'/read-all-all/:limit/:page',
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

				const returned = await postsCollection.c_readAllAll(limit, skip)
	
				res.status(200).send(returned)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/administration/posts: Invalid params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/administration/posts: Error --> ${err}`,
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
				Number.isInteger(parseInt(req.params.page)) &&
				Number.isInteger(parseInt(req.params.limit))
			) {
				// [INIT] //
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit

				// [READ-ALL] Posts with cat_id //
				const postsObj = await postsCollection.c_readAll(
					req.params.cat_id,
					limit,
					skip,
				)

				if (postsObj.status) {
					// [COUNT] Posts //
					postsObj.postCount = (
						await postsCollection.c_countAllByCat(req.params.cat_id)
					).count

					// [COUNT] Calculate Pages //
					postsObj.pageCount = Math.ceil(postsCount.count / limit)

					// For Each Post in Posts //
					for (let i = 0; i < postsObj.posts.length; i++) {
						// [COUNT] Likes //
						postsObj.posts[i].likeCount = (
							await postLikesCollection.c_countAll(postsObj.posts[i]._id)
						).count
						
						// [COUNT] Follows //
						postsObj.posts[i].followsCount = (
							await postFollowsCollection.c_countAll(postsObj.posts[i]._id)
						).count
						
						// [COUNT] Comment //
						postsObj.posts[i].commentCount = (
							await commentsCollection.c_countAllByPost(postsObj.posts[i]._id)
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
								await postFollowsCollection.c_existance(
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
				const postObj = await postsCollection.c_read(req.params.post_id)

				if (postObj.status) {
					// [COUNT] Likes //
					postObj.post.likeCount = (
						await postLikesCollection.c_countAll(postObj.post._id)
					).count
		
					// [COUNT] Follows //
					postObj.post.followsCount = (
						await postFollowsCollection.c_countAll(postObj.post._id)
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
							await postFollowsCollection.c_existance(
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


/******************* [OTHER-CURD] *******************/
// [READ-ALL-SORT] Within Cat //
router.get(
	'/read-all-sort/:cat_id/:sort/:limit/:page',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.params.cat_id) &&
				Number.isInteger(parseInt(req.params.sort)) &&
				Number.isInteger(parseInt(req.params.limit)) &&
				Number.isInteger(parseInt(req.params.page))
			) {
				// [INIT] //
				const sort = parseInt(req.params.sort)
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit

				// [READ-ALL] Sort //
				const postsObj = await postsCollection.c_readAllSort(
					req.params.cat_id,
					sort,
					limit,
					skip,
				)

				if (postsObj.status) {
					// [PINNED] Insert Posts //
					const { posts: pinnedPosts } = await postsCollection.c_readAllPinned(
						req.params.cat_id
					)
					
					// For Each Pinned Post Insert It At the Beginning of Array //
					pinnedPosts.forEach(p => { postsObj.posts.unshift(p) })

					// For Each Post in Posts //
					for (let i = 0; i < postsObj.posts.length; i++) {
						// [COUNT] Likes //
						postsObj.posts[i].likeCount = (
							await postLikesCollection.c_countAll(postsObj.posts[i]._id)
						).count
						
						// [COUNT] Follows //
						postsObj.posts[i].followsCount = (
							await postFollowsCollection.c_countAll(postsObj.posts[i]._id)
						).count
						
						// [COUNT] Comment //
						postsObj.posts[i].commentCount = (
							await commentsCollection.c_countAllByPost(postsObj.posts[i]._id)
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
			
							// [FOLLOWED-STATUS] //
							postsObj.posts[i].followed = (
								await postFollowsCollection.c_existance(
									req.decoded.user_id,
									postsObj.posts[i]._id
								)
							).existance
						}
					}
					// [COUNT] Posts //
					postsObj.postsCount = (
						await postsCollection.c_countAllByCat(req.params.cat_id)
					).count
					
					// [COUNT] Calculate Pages //
					postsObj.pageCount = Math.ceil(postsObj.postsCount / limit)
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
				mongoose.isValidObjectId(req.body.post_id) &&
				mongoose.isValidObjectId(req.body.postUser_id)
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
	'/unlike',
	rateLimiter.likeLimiter,
	Auth.userToken(),
	async (req, res) => {
		try {
			if (mongoose.isValidObjectId(req.body.post_id)) {
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
	'/follow',
	Auth.userToken(),
	rateLimiter.followLimiter,
	async (req, res) => {
		try {
			if (mongoose.isValidObjectId(req.body.post_id)) {
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
	'/unfollow',
	rateLimiter.followLimiter,
	Auth.userToken(),
	async (req, res) => {
		try {
			if (mongoose.isValidObjectId(req.body.post_id)) {
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


/******************* [COUNT] *******************/
router.get(
	'/count/:cat_id',
	async (req, res) => {
		try {
			if (validator.isAscii(req.params.cat_id)) {
				const returned = await postsCollection.c_countAllByCat(req.params.cat_id)

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