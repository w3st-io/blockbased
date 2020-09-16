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
require('dotenv').config()


// [REQUIRE] Personal //
const rateLimiter = require('../../rate-limiters')
const postsCollection = require('../../server-collections/postsCollection')
const postFollowersCollection = require('../../server-collections/postFollowersCollection')
const commentsCollection = require('../../server-collections/commentsCollection')
const commentLikesCollection = require('../../server-collections/commentLikesCollection')
const commentReportsCollection = require('../../server-collections/commentReportsCollection')
const notificationsCollection = require('../../server-collections/notificationsCollection')
const Auth = require('../../server-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userToken(),
	rateLimiter.commentLimiter,
	async (req, res) => {
		// [INIT] //
		let returnFollowers = []
		
		// [VALIDATE] //
		if (
			validator.isAscii(req.body.post_id) &&
			req.body.text
		) {
			const postExistance = await postsCollection.c_existance(req.body.post_id)

			if (postExistance.existance) {
				const returned = await commentsCollection.c_create(
					req.decoded._id,
					req.body.post_id,
					req.body.text
				)

				if (returned.status) {
					// [READ-ALL] Followers //
					const followers = await postFollowersCollection.c_readAll(
						req.body.post_id
					)
					
					// [CREATE] Notification //
					for (let i = 0; i < followers.postFollowers.length; i++) {
						await notificationsCollection.c_create(
							followers.postFollowers[i].user,
							returned.comment._id,
							'comment'
						)

						returnFollowers.push(followers.postFollowers[i].user)
					}

					/*
					* Send follwors so they are notificed and the comment count to know
					* what the last page is
					*/
					res.status(201).send({
						executed: true,
						status: true,
						created: returned,
						postFollowers: returnFollowers,
						commentCount: await commentsCollection.c_countAll(req.body.post_id)
					})
				}
				else { res.status(200).send(returned) }
			}
			else { res.status(200).send(postExistance) }
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'comments: Invalid Params'
			})
		}
	},
)


// [READ-ALL] //
router.get(
	'/read-all/:post_id/:limit/:skip',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		// [VALIDATE] //
		if (
			mongoose.isValidObjectId(req.params.post_id) &&
			Number.isAscii(parseInt(req.params.limit)) &&
			Number.isAscii(parseInt(req.params.skip))
		) {
			const postExistance = await postsCollection.c_existance(req.params.post_id)

			if (postExistance.existance) {
				const returned = await commentsCollection.c_readAll(
					req.params.post_id,
					parseInt(req.params.skip),
					parseInt(req.params.limit)
				)
				
				if (returned.status) {
					// For Each Post in Posts //
					for (let i = 0; i < returned.comments.length; i++) {
						try {
							// Set Like Count //
							const count = await commentLikesCollection.c_countAll(
								returned.comments[i]._id
							)
		
							returned.comments[i].likeCount = count.count
						}
						catch (err) { console.log(`comments: Error --> ${err}`) }
		
						if (req.decoded) {
							try {
								// Set Liked Status //
								const liked = await commentLikesCollection.c_existance(
									req.decoded._id,
									returned.comments[i]._id
								)
			
								returned.comments[i].liked = liked.existance
							}
							catch (err) { console.log(`comments: Error --> ${err}`) }
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
				message: 'comments: Invalid params',
			})
		}
	},
)


// [READ] //
router.get(
	'/read/:_id',
	async (req, res) => {
		// [VALIDATE] //
		if (mongoose.isValidObjectId(req.params._id)) {
			const returned = await commentsCollection.c_read(req.params._id)
		
			if (returned.status) {
				// Set Like Count //
				try {
					const count = await commentLikesCollection.c_countAll(req.params._id)

					returned.comment.likeCount = count.count
				}
				catch (err) { console.log(`comment: Error --> ${err}`) }

				// Set Liked Status //
				if (req.decoded) {
					// Set Like Count //
					try {
						// check if the post like exist..
						const liked = await commentLikesCollection.c_existance(
							req.decoded._id,
							returned.comment._id
						)

						returned.comment.liked = liked.existance
					}
					catch (err) { console.log(`comment: Error --> ${err}`) }
				}
			}

			res.status(200).send(returned)
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'Invalid comment _id'
			})
		}
	},
)


// [UPDATE] Auth Required //
router.post(
	'/update/:_id',
	Auth.userToken(),
	async (req, res) => {
		// [VALIDATE] //
		if (
			mongoose.isValidObjectId(req.params._id) &&
			req.body.text
		) {
			// [UPDATE] //
			const comment = await commentsCollection.c_update(
				req.params._id,
				req.decoded._id,
				req.body.text
			)
			
			res.status(201).send(comment)
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'Invalid params'
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
			// [DELETE] //
			const comment = await commentsCollection.c_delete(
				req.params._id,
				req.decoded._id,
			)
				
			if (comment.status) {
				// [DELETE] CommentLike //
				const commentLikes = await commentLikesCollection.c_deleteAll(
					req.params._id
				)

				// [DELETE] Notifications //
				const notifications = await notificationsCollection.c_deleteAll(
					req.params._id
				)

				res.status(201).send({
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
				message: 'Invalid comment _id'
			})
		}
	},
)


/******************* [LIKE SYSTEM] *******************/
// [LIKE] Auth Required //
router.post(
	'/like/:_id/:post_id',
	Auth.userToken(),
	rateLimiter.likeLimiter,
	async (req, res) => {
		// [VALIDATE] //
		if (
			mongoose.isValidObjectId(req.params._id) &&
			mongoose.isValidObjectId(req.params.post_id)
		) {
			// [CREATE] CommentLike //
			const commentLike = await commentLikesCollection.c_create(
				req.decoded._id,
				req.params.post_id,
				req.params._id,
			)

			res.status(200).send(commentLike)
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'comments: Invalid params'
			})
		}
	},
)

// [UNLIKE] Auth Required //
router.post(
	'/unlike/:_id',
	Auth.userToken(),
	rateLimiter.likeLimiter,
	async (req, res) => {
		// [VALIDATE] //
		if (mongoose.isValidObjectId(req.params._id)) {
			// [DELETE] CommentLike //
			const commentLike = await commentLikesCollection.c_delete(
				req.decoded._id,
				req.params._id,
			)
			
			res.status(200).send(commentLike)
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'Invalid comment _id'
			})
		}
	},
)


/******************* [REPORTS] *******************/
// [CREATE] //
router.post(
	'/report/:_id',
	Auth.userToken(),
	rateLimiter.reportLimiter,
	async (req, res) => {
		// [VALIDATE] //
		if (
			mongoose.isValidObjectId(req.params._id) &&
			validator.isAscii(req.body.post_id) &&
			validator.isAscii(req.body.reportType)
		) {
			const returned = await commentReportsCollection.c_create(
				req.decoded._id,
				req.params._id,
				req.body.post_id,
				req.body.reportType
			)
			
			res.status(201).send(returned)
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'Invalid params',
			})
		}
	},
)


// [EXPORT] //
module.exports = router