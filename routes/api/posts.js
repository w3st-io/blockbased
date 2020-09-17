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
const rateLimiter = require('../../rate-limiters')
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
			const returned = await postsCollection.c_create(
				req.decoded._id,
				req.body.cat_id,
				req.body.title
			)
			const returned2 = await commentsCollection.c_create(
				req.decoded._id,
				returned.createdPost._id,
				req.body.text
			)

			res.status(201).send({
				executed: true,
				status: true,
				post: returned,
				comment: returned2
			})
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'posts: Invalid Params'
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
			const postsObj = await postsCollection.c_readAll(
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

				// Post Count //
				postsObj.postCount = (
					await postsCollection.c_countAll(req.params.cat_id)
				).count
				
				// Page Count //
				postsObj.pageCount = Math.ceil(postsCount.count / req.params.limit)
			}

			res.status.send(postsObj)
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'posts: Invalid Params'
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

			}
			catch (err) {
				postObj = {
					executed: false,
					status: false,
					message: `posts: Error --> ${err}`
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
	},
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.userToken(),
	async (req, res) => {
		// [VALIDATE] //
		if (mongoose.isValidObjectId(req.params._id)) {
			const ownership = await postsCollection.c_ownership(
				req.params._id,
				req.decoded._id,
			)
			
			if (ownership.status && ownership.ownership) {
				const returned = await postsCollection.c_delete(req.params._id)
				const returned2 = await postLikesCollection.c_deleteAll(req.params._id)

				res.status(200).send({
					executed: true,
					status: true,
					deleted: [returned, returned2]
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
			const postsObj = await postsCollection.c_readAll(
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

				// Post Count //
				postsObj.postCount = (
					await postsCollection.c_countAll(req.params.cat_id)
				).count
				
				// Page Count //
				postsObj.pageCount = Math.ceil(postsCount.count / req.params.limit)
			}

			res.status.send(postsObj)
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'posts: Invalid Params'
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

					res.status(201).send({
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
					
					res.status(201).send({
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
			const returned = await postFollowersCollection.c_create(
				req.decoded._id,
				req.params._id
			)
			
			res.status(201).send(returned)
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
			const returned = await postFollowersCollection.c_delete(
				req.decoded._id,
				req.params._id
			)
			
			res.status(201).send(returned)
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
			const returned = await postsCollection.c_countAll(req.params.cat_id)

			if (returned.status) { res.status(200).send(returned.count.toString()) }
			else { res.status(200).send(returned.message.toString()) }
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'posts: Invalid Params'
			})
		}
	},
)


// [EXPORT] //
module.exports = router