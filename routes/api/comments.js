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
const BlocksCollection = require('../../server-collections/BlocksCollection')
const CommentsCollection = require('../../server-collections/CommentsCollection')
const CommentLikesCollection = require('../../server-collections/CommentLikesCollection')
const CommentReportsCollection = require('../../server-collections/CommentReportsCollection')
const NotificationsCollection = require('../../server-collections/NotificationsCollection')
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

		const existance = await BlocksCollection.c_existance(req.body.block_id)

		if (existance.status && existance.existance) {
			const returnedData = await CommentsCollection.c_create(
				req.decoded._id,
				req.body.block_id,
				req.body.text
			)
			
			// Create Notification for Followers
			for (let i = 0; i < blockFollowers.length; i++) {
				await NotificationsCollection.c_create(
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
		const comments = await CommentsCollection.c_readAll(
			req.params.block_id,
			req.params.skip,
			req.params.amount
		)

		// For Each Block in Blocks //
		for (let i = 0; i < comments.length; i++) {
			// Set Like Count //
			try {
				comments[i].likeCount = await CommentLikesCollection.c_countAll(
					comments[i]._id
				)
			}
			catch (e) { console.log(`Caught Error --> ${e}`) }

			// Set Liked Status //
			if (req.decoded) {
				// check if the block like exist..
				const liked = await CommentLikesCollection.c_existance(
					req.decoded._id,
					comments[i]._id
				)

				comments[i].liked = liked.existance
			}
		}
		
		res.status(200).send(comments)
	}
)


// [READ] //
router.get(
	'/read/:_id',
	async (req, res) => {
		const comment = await CommentsCollection.c_read(req.params._id)

		
		// Set Like Count //
		try {
			comment.likeCount = await CommentLikesCollection.c_countAll(comment._id)
		}
		catch (e) { console.log(`Caught Error --> ${e}`) }

		// Set Liked Status //
		if (req.decoded) {
			// check if the block like exist..
			const liked = await CommentLikesCollection.c_existance(
				req.decoded._id,
				comment._id
			)

			comment.liked = liked.existance
		}

		res.status(200).send(comment)
	}
)


// [UPDATE] Auth Required //
router.post(
	'/update/:_id',
	Auth.userToken(),
	async (req, res) => {
		const ownership = await CommentsCollection.c_ownership(
			req.decoded._id,
			req.params._id
		)

		if (req.body.text.length < 6000) {
			if (ownership.status && ownership.ownership) {
				const returnedData = await CommentsCollection.c_update(
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
		const ownership = await CommentsCollection.c_ownership(
			req.decoded._id,
			req.params._id
		)

		if (ownership.status && ownership.ownership) {
			// [DELETE] Comment // [DELETE] CommentLike // [DELETE] Notifications //
			const returnedData = await CommentsCollection.c_delete(
				req.decoded._id,
				req.params._id
			)
			const returnedData2 = await CommentLikesCollection.c_deleteAll(
				req.params._id
			)
			const returnedData3 = await NotificationsCollection.c_deleteAll(
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
	rateLimiter.likelimiter,
	async (req, res) => {
		// [CREATE] CommentLike //
		const returnedData = await CommentLikesCollection.c_create(
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
	rateLimiter.likelimiter,
	async (req, res) => {
		// [DELETE] CommentLike //
		const returnedData = await CommentLikesCollection.c_delete(
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
	async (req, res) => {
		const existance = await CommentReportsCollection.c_existance(
			req.decoded._id,
			req.params._id
		)
		
		if (existance.status && !existance.existance) {
			const returnedData = await CommentReportsCollection.c_create(
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
		const existance = await CommentsCollection.c_existance(req.params._id)

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
		const ownership = await CommentsCollection.c_ownership(
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
		const count = await CommentsCollection.c_countAll(req.params.block_id)
	
		res.status(201).send(count.toString())
	}
)


// [EXPORT] //
module.exports = router