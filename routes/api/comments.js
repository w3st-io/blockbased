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
const Auth = require('../../server-middleware/AuthMiddleware')
const BlocksCollection = require('../../server-collections/BlocksCollection')
const CommentsCollection = require('../../server-collections/CommentsCollection')
const CommentLikesCollection = require('../../server-collections/CommentLikesCollection')
const CommentReportsCollection = require('../../server-collections/CommentReportsCollection')
const NotificationsCollection = require('../../server-collections/NotificationsCollection')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [COMMENT] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userToken(),
	async (req, res) => {
		const user_id = req.decoded._id
		const block_id = req.body.block_id
		const blockFollowers = req.body.blockFollowers
		const text = req.body.text

		const existance = await BlocksCollection.c_existance(block_id)

		if (existance.status && existance.existance) {
			const returnedData = await CommentsCollection.c_create(
				user_id,
				block_id,
				text
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


// [READ-ALL-ALL] //
router.get(
	'/read-all-all/:amount/:skip',
	async (req, res) => {
		const skip = req.params.skip
		const amount = req.params.amount

		const returnedData = await CommentsCollection.c_readAllAll(skip, amount)
		
		res.status(200).send(returnedData)
	}
)


// [READ-ALL] //
router.get(
	'/read-all/:block_id/:amount/:skip',
	async (req, res) => {
		const block_id = req.params.block_id
		const skip = req.params.skip
		const amount = req.params.amount

		const returnedData = await CommentsCollection.c_readAll(block_id, skip, amount)
		
		res.status(200).send(returnedData)
		
	}
)


// [READ] //
router.get(
	'/read/:_id',
	async (req, res) => {
		const comment_id = req.params._id

		const returnedData = await CommentsCollection.c_read(comment_id)

		res.status(200).send(returnedData)
	}
)


// [UPDATE] Auth Required //
router.post(
	'/update/:_id',
	Auth.userToken(),
	async (req, res) => {
		const user_id = req.decoded._id
		const comment_id = req.params._id
		const text = req.body.text

		const ownership = await CommentsCollection.c_ownership(user_id, comment_id)

		if (req.body.text.length < 6000) {
			if (ownership.status && ownership.ownership) {
				const returnedData = await CommentsCollection.c_update(comment_id, text)

				res.status(201).send(returnedData)
			}
			else { res.status(400).send(ownership.message) }
		}
		else { res.status(400).send('Comment too large') }
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.userToken(),
	async (req, res) => {
		const user_id = req.decoded._id
		const comment_id = req.params._id

		const ownership = await CommentsCollection.c_ownership(user_id, comment_id)

		if (ownership.status && ownership.ownership) {
			// [DELETE] Comment // [DELETE] CommentLike //
			const returnedData = await CommentsCollection.c_delete(user_id, comment_id)
			const returnedData2 = await CommentLikesCollection.c_deleteAll(comment_id)
			const returnedData3 = await NotificationsCollection.c_deleteAll(comment_id)

			res.status(201).send([returnedData, returnedData2, returnedData3])
		}
		else { res.status(400).send(ownership.message) }
	}
)


/******************* [LIKE SYSTEM] *******************/
// [LIKE] Auth Required //
router.post(
	'/like/:_id/:block_id',
	Auth.userToken(),
	async (req, res) => {
		const user_id = req.decoded._id
		const comment_id = req.params._id
		const block_id = req.params.block_id

		// [UPDATE] Comment's Likers // [CREATE] CommentLike //
		const returnedData = await CommentsCollection.c_like(user_id, comment_id)
		const returnedData2 = await CommentLikesCollection.c_create(
			user_id,
			block_id,
			comment_id
		)

		res.status(201).send([returnedData, returnedData2])
	}
)


// [UNLIKE] Auth Required //
router.post(
	'/unlike/:_id',
	Auth.userToken(),
	async (req, res) => {
		const user_id = req.decoded._id
		const comment_id = req.params._id

		// [UPDATE] Comment's Likers // [DELETE] CommentLike //
		const returnedData = await CommentsCollection.c_unlike(user_id, comment_id)
		const returnedData2 = await CommentLikesCollection.c_delete(user_id, comment_id)
		
		res.status(201).send([returnedData, returnedData2])
	}
)


/******************* [REPORTS] *******************/
// [CREATE] //
router.post(
	'/report/:_id',
	Auth.userToken(),
	async (req, res) => {
		const user_id = req.decoded._id
		const comment_id = req.params._id
		const block_id = req.body.block_id
		const reportType = req.body.reportType

		const existance = await CommentReportsCollection.c_existance(user_id, comment_id)
		
		if (existance.status && !existance.existance) {
			const returnedData = await CommentReportsCollection.c_create(
				user_id,
				comment_id,
				block_id,
				reportType
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
		const comment_id = req.params._id

		const existance = await CommentsCollection.c_existance(comment_id)

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
		const user_id = req.decoded._id
		const comment_id = req.params._id

		const ownership = await CommentsCollection.c_ownership(user_id, comment_id)

		if (ownership.status) {
			if (ownership.ownership) { res.status(200).send(true) }
			else { res.status(200).send(false) }
		}
		else { res.status(400).send(ownership.message) }
	}
)


/******************* [COUNT] *******************/
router.get(
	'/count/:block_id',
	async (req, res) => {
		const block_id = req.params.block_id

		const count = await CommentsCollection.c_count(block_id)
	
		res.status(201).send(count.toString())
	}
)


// [EXPORT] //
module.exports = router