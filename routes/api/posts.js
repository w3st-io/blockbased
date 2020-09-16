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
const postsCollection = require('../../server-collections/postsCollection')
const postFollowersCollection = require('../../server-collections/postFollowersCollection')
const postLikesCollection = require('../../server-collections/postLikesCollection')
const commentsCollection = require('../../server-collections/commentsCollection')
const Auth = require('../../server-middleware/Auth')


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
			let returned = await postsCollection.c_readAll(
				req.params.cat_id,
				parseInt(req.params.skip),
				parseInt(req.params.limit),
				req.params.sort,
			)
			
			if (returned.status) {
				// For Each Post in Posts //
				for (let i = 0; i < returned.posts.length; i++) {
					// Like Count //
					const likeCount = await postLikesCollection.c_countAll(
						returned.posts[i]._id
					)
		
					if (likeCount.status) {
						returned.posts[i].likeCount = likeCount.count
					}	
					else { returned.posts[i].likeCount = likeCount.message }
		
					
					// Follow Count //
					const followersCount = await postFollowersCollection.c_countAll(
						returned.posts[i]._id
					)
					
					if (followersCount.status) {
						returned.posts[i].followersCount = followersCount.count
					}
					else { returned.posts[i].followersCount = followersCount.message }
		
					
					// Comment Count //
					const commentCount = await commentsCollection.c_countAll(
						returned.posts[i]._id
					)
					
					if (commentCount.status) {
						returned.posts[i].commentCount = commentCount.count
					}
					else { returned.posts[i].commentCount = commentCount.message }
		
					
					// Post Count //
					const postsCount = await postsCollection.c_countAll(req.params.cat_id)
		
					if (postsCount.status) {
						returned.postCount = postsCount.count
						
						// Page Count //
						returned.pageCount = Math.ceil(postsCount.count / req.params.limit)
					}
					else { returned.posts[i].postsCount = postsCount.message }


					// If User Token Passed.. //
					if (req.decoded) {
						// Liked Status //
						const liked = await postLikesCollection.c_existance(
							req.decoded._id,
							returned.posts[i]._id
						)
		
						if (liked.status) { returned.posts[i].liked = liked.existance }
						else { returned.posts[i].liked = liked.message }
		
						// Follwed Status //
						const followed = await postFollowersCollection.c_existance(
							req.decoded._id,
							returned.posts[i]._id
						)
						
						if (followed.status) {
							returned.posts[i].followed = followed.existance
						}
						else { returned.posts[i].followed = followed.message }
					}
				}
			}

			res.status(200).send(returned)
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
			let returned = await postsCollection.c_read(req.params._id)
			
			if (returned.status) {
				// Set Like Count //
				try {
					const count = await postLikesCollection.c_countAll(
						returned.post._id
					)
	
					returned.post.likeCount = count.count
				}
				catch (err) { console.log(`posts: Error --> ${err}`) }
	
				// Follow Count //
				try {
					const count = await postFollowersCollection.c_countAll(
						returned.post._id
					)
	
					returned.post.followersCount = count.count
				}
				catch (err) { console.log(`posts: Error --> ${err}`) }
	
				// If User Logged In.. //
				if (req.decoded) {
					// Liked Status //
					const liked = await postLikesCollection.c_existance(
						req.decoded._id,
						returned.post._id
					)
	
					returned.post.liked = liked.existance
	
					// Follwed Status //
					const followed = await postFollowersCollection.c_existance(
						req.decoded._id,
						returned.post._id
					)
	
					returned.post.followed = followed.existance
				}
			}

			res.status(200).send(returned)
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
					delete: [returned, returned2]
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


/******************* [LIKE SYSTEM] *******************/
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