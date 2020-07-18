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
const CommentReportsCollection = require('../../server-collections/CommentReportsCollections')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [COMMENT] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userToken(),
	async (req, res) => { 
		const existance = await BlocksCollection.existance(req.body.block_id)

		if (existance.status == true && existance.existance == true) {
			const returnedData = await CommentsCollection.create(
				req.decoded._id,
				req.body.block_id,
				req.body.text
			)

			res.status(201).send(returnedData)
		}
		else { res.status(400).send(existance.message) }
	}
)


// [READ-ALL-ALL] //
router.get(
	'/read-all-all/:amount/:skip',
	async (req, res) => {
		const returnedData = await CommentsCollection.readAllAll(
			req.params.skip,
			req.params.amount
		)
		
		res.status(200).send(returnedData)
	}
)


// [READ-ALL] //
router.get(
	'/read-all/:block_id/:amount/:skip',
	async (req, res) => {
		const returnedData = await CommentsCollection.readAll(
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
		const returnedData = await CommentsCollection.read(req.params._id)

		res.status(200).send(returnedData)
	}
)


// [UPDATE] Auth Required //
router.post(
	'/update/:_id',
	Auth.userToken(),
	async (req, res) => {
		const ownership = await CommentsCollection.ownership(
			req.decoded._id,
			req.params._id
		)

		if (ownership.status == true && ownership.ownership == true) {
			const returnedData = await CommentsCollection.update(
				req.decoded._id,
				req.params._id,
				req.body.text
			)

			res.status(201).send(returnedData)
		}
		else { res.status(400).send(ownership.message) }
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.userToken(),
	async (req, res) => {
		const ownership = await CommentsCollection.ownership(
			req.decoded._id,
			req.params._id
		)

		if (ownership.status == true && ownership.ownership == true) {
			// [DELETE] Comment //
			const returnedData = await CommentsCollection.delete(
				req.decoded._id,
				req.params._id
			)

			// [DELETE] CommentLike //
			const returnedData2 = await CommentLikesCollection.deleteAll(
				req.params._id
			)

			res.status(201).send([returnedData, returnedData2])
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
		// [UPDATE] Comment's Likers //
		const returnedData = await CommentsCollection.like(
			req.decoded._id,
			req.params._id
		)

		// [CREATE] CommentLike //
		const returnedData2 = await CommentLikesCollection.create(
			req.decoded._id,
			req.params.block_id,
			req.params._id
		)

		res.status(201).send([returnedData, returnedData2])
	}
)


// [UNLIKE] Auth Required //
router.post(
	'/unlike/:_id',
	Auth.userToken(),
	async (req, res) => {
		// [UPDATE] Comment's Likers //
		const returnedData = await CommentsCollection.unlike(
			req.decoded._id,
			req.params._id
		)

		// [DELETE] CommentLike //
		const returnedData2 = await CommentLikesCollection.delete(
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
		const existance = await CommentReportsCollection.existance(
			req.decoded._id,
			req.params._id
		)
		
		if (existance.status == true && existance.existance == false) {
			const returnedData = await CommentReportsCollection.create(
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
		const existance = await CommentsCollection.existance(req.params._id)

		if (existance.status == true) {
			if (existance.existance == true) { res.status(200).send(true) }
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
		const ownership = await CommentsCollection.ownership(
			req.decoded._id,
			req.params._id
		)

		if (ownership.status == true) {
			if (ownership.ownership == true) { res.status(200).send(true) }
			else { res.status(200).send(false) }
		}
		else { res.status(400).send(ownership.message) }
	}
)


/******************* [COUNT] *******************/
router.get(
	'/count/:block_id',
	async (req, res) => {
		const count = await CommentsCollection.count(req.params.block_id)
	
		res.status(201).send(count.toString())
	}
)


// [EXPORT] //
module.exports = router