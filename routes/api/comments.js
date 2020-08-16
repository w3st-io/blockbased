/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
require('dotenv').config()


// [REQUIRE] Personal //
const rateLimiter = require('../../rate-limiters')
const blocksCollection = require('../../server-collections/blocksCollection')
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
		const blockFollowers = req.body.blockFollowers

		const existance = await blocksCollection.c_existance(req.body.block_id)

		if (existance.status && existance.existance) {
			const returnedData = await commentsCollection.c_create(
				req.decoded._id,
				req.body.block_id,
				req.body.text
			)
			
			// Create Notification for Followers
			for (let i = 0; i < blockFollowers.length; i++) {
				await notificationsCollection.c_create(
					blockFollowers[i],
					returnedData.createdComment._id,
					'comment'
				)
			}

			res.status(201).send(returnedData)
		}
		else { res.status(400).send(existance.message) }
	}
)


// [READ-ALL] //
router.get(
	'/read-all/:block_id/:amount/:skip',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		const returnedData = await commentsCollection.c_readAll(
			req.params.block_id,
			req.params.skip,
			req.params.amount
		)

		// For Each Block in Blocks //
		for (let i = 0; i < returnedData.comments.length; i++) {
			// Set Like Count //
			try {
				returnedData.comments[i].likeCount = await commentLikesCollection.c_countAll(
					returnedData.comments[i]._id
				)
			}
			catch (e) { console.log(`Caught Error --> ${e}`) }

			// Set Liked Status //
			if (req.decoded) {
				// check if the block like exist..
				const liked = await commentLikesCollection.c_existance(
					req.decoded._id,
					returnedData.comments[i]._id
				)

				returnedData.comments[i].liked = liked.existance
			}
		}
		
		res.status(200).send(returnedData)
	}
)


// [READ] //
router.get(
	'/read/:_id',
	async (req, res) => {
		const returnedData = await commentsCollection.c_read(req.params._id)

		
		// Set Like Count //
		try {
			returnedData.comment.likeCount = await commentLikesCollection.c_countAll(comment._id)
		}
		catch (e) { console.log(`Caught Error --> ${e}`) }

		// Set Liked Status //
		if (req.decoded) {
			// check if the block like exist..
			const liked = await commentLikesCollection.c_existance(
				req.decoded._id,
				returnedData.comment._id
			)

			returnedData.comment.liked = liked.existance
		}

		res.status(200).send(returnedData)
	}
)


// [UPDATE] Auth Required //
router.post(
	'/update/:_id',
	Auth.userToken(),
	async (req, res) => {
		const ownership = await commentsCollection.c_ownership(
			req.decoded._id,
			req.params._id
		)

		if (req.body.text.length < 6000) {
			if (ownership.status && ownership.ownership) {
				const returnedData = await commentsCollection.c_update(
					req.params._id,
					req.body.text
				)

				res.status(201).send(returnedData)
			}
			else { res.status(400).send(ownership) }
		}
		else { res.status(400).send('Comment too large') }
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.userToken(),
	async (req, res) => {
		const ownership = await commentsCollection.c_ownership(
			req.decoded._id,
			req.params._id
		)

		if (ownership.status && ownership.ownership) {
			// [DELETE] Comment // [DELETE] CommentLike // [DELETE] Notifications //
			const returnedData = await commentsCollection.c_delete(
				req.decoded._id,
				req.params._id
			)
			const returnedData2 = await commentLikesCollection.c_deleteAll(
				req.params._id
			)
			const returnedData3 = await notificationsCollection.c_deleteAll(
				req.params._id
			)

			res.status(201).send([returnedData, returnedData2, returnedData3])
		}
		else { res.status(400).send(ownership) }
	}
)


/******************* [LIKE SYSTEM] *******************/
// [LIKE] Auth Required //
router.post(
	'/like/:_id/:block_id',
	Auth.userToken(),
	rateLimiter.likeLimiter,
	async (req, res) => {
		// [CREATE] CommentLike //
		const returnedData = await commentLikesCollection.c_create(
			req.decoded._id,
			req.params.block_id,
			req.params._id,
		)

		res.status(201).send(returnedData)
	}
)


// [UNLIKE] Auth Required //
router.post(
	'/unlike/:_id',
	Auth.userToken(),
	rateLimiter.likeLimiter,
	async (req, res) => {
		// [DELETE] CommentLike //
		const returnedData = await commentLikesCollection.c_delete(
			req.decoded._id,
			req.params._id
		)
		
		res.status(201).send(returnedData)
	}
)


/******************* [REPORTS] *******************/
// [CREATE] //
router.post(
	'/report/:_id',
	Auth.userToken(),
	rateLimiter.reportLimiter,
	async (req, res) => {
		const existance = await commentReportsCollection.c_existance(
			req.decoded._id,
			req.params._id
		)
		
		if (existance.status && !existance.existance) {
			const returnedData = await commentReportsCollection.c_create(
				req.decoded._id,
				req.params._id,
				req.body.block_id,
				req.body.reportType
			)
			
			res.status(201).send(returnedData)
		}
		else { res.status(400).send(existance.message) }
	}
)

/******************* [EXISTANCE + OWNERSHIP] *******************/
// [EXISTANCE] //
router.get(
	'/existance/:_id',
	async (req, res) => {
		const existance = await commentsCollection.c_existance(req.params._id)

		if (existance.status) {
			if (existance.existance) { res.status(200).send(true) }
			else { res.status(200).send(false) }
		}
		else { res.status(400).send(existance.message) }
	},
)


// [OWNERSHIP] //
router.get(
	'/ownership/:_id',
	Auth.userToken(),
	async (req, res) => {
		const ownership = await commentsCollection.c_ownership(
			req.decoded._id,
			req.params._id
		)

		if (ownership.status) {
			if (ownership.ownership) { res.status(200).send(true) }
			else { res.status(200).send(false) }
		}
		else { res.status(400).send(ownership) }
	}
)


/******************* [COUNT] *******************/
router.get(
	'/count/:block_id',
	async (req, res) => {
		const count = await commentsCollection.c_countAll(req.params.block_id)
	
		res.status(201).send(count.toString())
	}
)


// [EXPORT] //
module.exports = router