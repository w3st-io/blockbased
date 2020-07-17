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

		if (existance.status == true) {
			if (existance.existance == true) {
				const returnedData = await CommentsCollection.create(
					req.decoded._id,
					req.body.block_id,
					req.body.text
				)

				res.status(201).send(returnedData)
			}
			else { res.status(400).send() }
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

		res.status(201).send(returnedData)
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

		if (ownership.status) {
			if (ownership.ownership == true) {
				await CommentsCollection.update(
					req.params._id,
					req.body.text
				)

				res.status(201).send()
			}
			else { res.status(400).send() }
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

		if (ownership.status) {
			if (ownership.ownership == true) {
				await CommentsCollection.delete(req.decoded._id, req.params._id)
				await CommentLikesCollection.deleteAll(req.params._id)

				res.status(201).send()
			}
			else { res.status(400).send() }
		}
		else { res.status(400).send(ownership.message) }
	}
)


/******************* [VOTE SYSTEM] *******************/
// [PUSH] Auth Required //
router.post(
	'/like/:_id',
	Auth.userToken(),
	async (req, res) => {
		const existance = await CommentsCollection.LikeExistance(
			req.decoded._id,
			req.params._id
		)

		if (existance.status == true) {
			if (existance.existance == false) {
				const returnedData = await CommentsCollection.like(
					req.decoded._id,
					req.params._id
				)
				const returnedData2 = await CommentLikesCollection.create(
					req.decoded._id,
					req.body.block_id,
					req.params._id
				)
	
				res.status(201).send(returnedData)
			}
			else { res.status(200).send(existance) }
		}
		else { res.status(400).send(existance.message) }
	}
)


// [PULL] Auth Required //
router.post(
	'/unlike/:_id',
	Auth.userToken(),
	async (req, res) => {
		const existance = await CommentsCollection.LikeExistance(
			req.decoded._id,
			req.params._id
		)
		
		if (existance.status == true) {
			if (existance.existance == true) {
				const returnedData = await CommentsCollection.unlike(
					req.decoded._id,
					req.params._id
				)
				const returnedData2 = await CommentLikesCollection.delete(
					req.decoded._id,
					req.params._id
				)

				res.status(201).send(returnedData)
			}
			else { res.status(200).send(existance.message) }
		}
		else { res.status(400).send(existance.message) }
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
		
		if (existance.status == true) {
			if (existance.existance == false) {
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
		const count = (await CommentsCollection.count(req.params.block_id)).toString()
	
		res.status(201).send(count)
	}
)


// [EXPORT] //
module.exports = router