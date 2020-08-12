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
		const blockFollowers = req.body.blockFollowers

		console.log(blockFollowers);

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


// [READ-ALL-ALL] //
router.get(
	'/read-all-all/:amount/:skip',
	async (req, res) => {
		const returnedData = await CommentsCollection.c_readAllAll(
			req.params.skip,
			req.params.amount
		)
		
		res.status(200).send(returnedData)
	}
)


// [READ-ALL] //
router.get(
	'/read-all/:block_id/:amount/:skip',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		const returnedData = await CommentsCollection.c_readAll(
			req.params.block_id,
			req.params.skip,
			req.params.amount
		)
		
		res.status(200).send(returnedData)
	}
)


// [READ] //
router.get(
	'/read/:_id',
	async (req, res) => {
		const returnedData = await CommentsCollection.c_read(req.params._id)

		res.status(200).send(returnedData)
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
			// [DELETE] Comment // [DELETE] CommentLike //
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
	async (req, res) => {
		// [UPDATE] Comment's Likers // [CREATE] CommentLike //
		const returnedData = await CommentsCollection.c_like(
			req.decoded._id,
			req.params._id,
		)
		const returnedData2 = await CommentLikesCollection.c_create(
			req.decoded._id,
			req.params._id,
			req.params.block_id
		)

		res.status(201).send([returnedData, returnedData2])
	}
)


// [UNLIKE] Auth Required //
router.post(
	'/unlike/:_id',
	Auth.userToken(),
	async (req, res) => {
		// [UPDATE] Comment's Likers // [DELETE] CommentLike //
		const returnedData = await CommentsCollection.c_unlike(
			req.decoded._id,
			req.params._id
		)
		const returnedData2 = await CommentLikesCollection.c_delete(
			req.decoded._id,
			req.params._id
		)
		
		res.status(201).send([returnedData, returnedData2])
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
		const count = await CommentsCollection.c_count(req.params.block_id)
	
		res.status(201).send(count.toString())
	}
)


// [EXPORT] //
module.exports = router