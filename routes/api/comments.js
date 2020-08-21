/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()


// [REQUIRE] Personal //
const rateLimiter = require('../../rate-limiters')
const blocksCollection = require('../../server-collections/blocksCollection')
const blockFollowersCollection = require('../../server-collections/blockFollowersCollection')
const commentsCollection = require('../../server-collections/commentsCollection')
const commentLikesCollection = require('../../server-collections/commentLikesCollection')
const commentReportsCollection = require('../../server-collections/commentReportsCollection')
const notificationsCollection = require('../../server-collections/notificationsCollection')
const Auth = require('../../server-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [COMMENT] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userToken(),
	rateLimiter.commentLimiter,
	async (req, res) => {
		let returnFollowers = []
		const existance = await blocksCollection.c_existance(req.body.block_id)

		if (existance.status && existance.existance) {
			const returned = await commentsCollection.c_create(
				req.decoded._id,
				req.body.block_id,
				req.body.text
			)

			if (returned.status) {
				// Get Block Followers //
				const followers = await blockFollowersCollection.c_readAll(
					req.body.block_id
				)
				
				// [CREATE] Create Notification for Followers //
				for (let i = 0; i < followers.blockFollowers.length; i++) {
					await notificationsCollection.c_create(
						followers.blockFollowers[i].user,
						returned.createdComment._id,
						'comment'
					)

					returnFollowers.push(followers.blockFollowers[i].user)
				}

				res.status(201).send({
					status: true,
					created: returned,
					blockFollowers: returnFollowers,
					commentCount: await commentsCollection.c_countAll(req.body.block_id)
				})
			}
			else { res.status(200).send(returned) }
		}
		else { res.status(200).send(existance) }
	},
)

// [READ-ALL] //
router.get(
	'/read-all/:block_id/:amount/:skip',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params.block_id)) {
			const returned = await commentsCollection.c_readAll(
				req.params.block_id,
				req.params.skip,
				req.params.amount
			)
			
			if (returned.status) {
				// For Each Block in Blocks //
				for (let i = 0; i < returned.comments.length; i++) {
					// Set Like Count //
					try {
						const count = await commentLikesCollection.c_countAll(
							returned.comments[i]._id
						)
	
						returned.comments[i].likeCount = count.count
					}
					catch (e) { console.log(`comments: Caught Error --> ${e}`) }
	
					// Set Liked Status //
					if (req.decoded) {
						// check if the block like exist..
						const liked = await commentLikesCollection.c_existance(
							req.decoded._id,
							returned.comments[i]._id
						)
	
						returned.comments[i].liked = liked.existance
					}
				}
			}
			
			res.status(200).send(returned)
		}
		else {
			res.status(200).send({
				status: false,
				message: 'comments: Invalid block_id'
			})
		}
	},
)

// [READ] //
router.get(
	'/read/:_id',
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params._id)) {
			const returned = await commentsCollection.c_read(req.params._id)
			
			if (returned.status) {
				// Set Like Count //
				try {
					const count = await commentLikesCollection.c_countAll(
						req.params._id
					)

					returned.comment.likeCount = count.count
				}
				catch (e) { console.log(`comment: Caught Error --> ${e}`) }

				// Set Liked Status //
				if (req.decoded) {
					// check if the block like exist..
					const liked = await commentLikesCollection.c_existance(
						req.decoded._id,
						returned.comment._id
					)

					returned.comment.liked = liked.existance
				}
			}

			res.status(200).send(returned)
		}
		else { res.status(200).send({ status: false, message: 'invalid _id' }) }
	},
)

// [UPDATE] Auth Required //
router.post(
	'/update/:_id',
	Auth.userToken(),
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params._id)) {
			const ownership = await commentsCollection.c_ownership(
				req.decoded._id,
				req.params._id
			)

			if (ownership.status && ownership.ownership) {
				if (req.body.text.length < 6000) {
					const returned = await commentsCollection.c_update(
						req.params._id,
						req.body.text
					)

					res.status(201).send(returned)
				}
				else { res.status(200).send('Comment too large') }
			}
			else { res.status(200).send(ownership) }
		}
		else { res.status(200).send({ status: false, message: 'invalid _id' }) }
	},
)

// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.userToken(),
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params._id)) {
			const ownership = await commentsCollection.c_ownership(
				req.decoded._id,
				req.params._id
			)

			if (ownership.status && ownership.ownership) {
				// [DELETE] Comment // [DELETE] CommentLike // [DELETE] Notifications //
				const returned = await commentsCollection.c_delete(
					req.decoded._id,
					req.params._id
				)
				const returned2 = await commentLikesCollection.c_deleteAll(
					req.params._id
				)
				const returned3 = await notificationsCollection.c_deleteAll(
					req.params._id
				)

				res.status(201).send({
					status: true,
					deletedStuff: [returned, returned2, returned3],
				})
			}
			else { res.status(200).send(ownership) }
		}
		else { res.status(200).send({ status: false, message: 'invalid _id' }) }
	},
)


/******************* [LIKE SYSTEM] *******************/
// [LIKE] Auth Required //
router.post(
	'/like/:_id/:block_id',
	Auth.userToken(),
	rateLimiter.likeLimiter,
	async (req, res) => {
		if (
			mongoose.isValidObjectId(req.params._id) &&
			mongoose.isValidObjectId(req.params.block_id)
		) {
			// [CREATE] CommentLike //
			const returned = await commentLikesCollection.c_create(
				req.decoded._id,
				req.params.block_id,
				req.params._id,
			)

			res.status(200).send(returned)
		}
		else { res.status(200).send({ status: false, message: 'invalid params' }) }
	},
)

// [UNLIKE] Auth Required //
router.post(
	'/unlike/:_id',
	Auth.userToken(),
	rateLimiter.likeLimiter,
	async (req, res) => {
		if (
			mongoose.isValidObjectId(req.params._id) &&
			mongoose.isValidObjectId(req.params.block_id)
		) {
			// [DELETE] CommentLike //
			const returned = await commentLikesCollection.c_delete(
				req.decoded._id,
				req.params._id
			)
			
			res.status(200).send(returned)
		}
		else { res.status(200).send({ status: false, message: 'invalid params' }) }
	},
)


/******************* [REPORTS] *******************/
// [CREATE] //
router.post(
	'/report/:_id',
	Auth.userToken(),
	rateLimiter.reportLimiter,
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params._id)) {
			const existance = await commentReportsCollection.c_existance(
				req.decoded._id,
				req.params._id
			)
			
			if (existance.status && !existance.existance) {
				const returned = await commentReportsCollection.c_create(
					req.decoded._id,
					req.params._id,
					req.body.block_id,
					req.body.reportType
				)
				
				res.status(201).send(returned)
			}
			else { res.status(200).send(existance) }
		}
		else { res.status(200).send({ status: false, message: 'invalid _id' }) }
	},
)


/******************* [EXISTANCE] *******************/
router.get(
	'/existance/:_id',
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params._id)) {
			const existance = await commentsCollection.c_existance(req.params._id)

			if (existance.status) {
				if (existance.existance) { res.status(200).send(true) }
				else { res.status(200).send(false) }
			}
			else { res.status(200).send(existance) }
		}
		else { res.status(200).send({ status: false, message: 'invalid _id' }) }
	},
)


// [EXPORT] //
module.exports = router