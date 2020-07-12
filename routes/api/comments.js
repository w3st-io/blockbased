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
const CommentVotesCollection = require('../../server-collections/CommentVotesCollection')
const ReportsCollection = require('../../server-collections/ReportsCollections')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userTokenCheck(),
	async (req, res) => { 
		const existance = await BlocksCollection.existance(req.body.block_id)

		if (existance == true) {
			await CommentsCollection.create(req)
			
			res.status(201).send()
		}
		else { res.status(400).send() }
	}
)


// [READ-ALL] //
router.get(
	'/read-all/:block_id/:amountPerPage/:skip',
	async (req, res) => {
		const returnedData = await CommentsCollection.readAll(req)

		res.status(201).send(returnedData)
	}
)


// [READ] //
router.get(
	'/read/:_id',
	async (req, res) => {
		const returnedData = await CommentsCollection.read(req)

		res.status(201).send(returnedData)
	}
)


// [UPDATE] Auth Required //
router.post(
	'/update/:_id',
	Auth.userTokenCheck(),
	async (req, res) => {
		const owned = await CommentsCollection.verifyOwnership(req)

		if (owned == true) {
			await CommentsCollection.update(req)
			res.status(201).send()
		}
		else { res.status(400).send() }
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.userTokenCheck(),
	async (req, res) => {
		const owned = await CommentsCollection.verifyOwnership(req)

		if (owned == true) {
			await CommentsCollection.delete(req)
			await CommentVotesCollection.deleteAll(req)

			res.status(201).send()
		}
		else { res.status(400).send() }
	}
)


/******************* [VOTE SYSTEM] *******************/
// [PUSH] Auth Required //
router.post(
	'/vote/:_id/:block_id',
	Auth.userTokenCheck(),
	async (req, res) => {
		const existance = await CommentsCollection.voterExistance(req)

		// go back and fix existance is blocks
		if (existance) {
			await CommentsCollection.pushVoter(req)
			await CommentVotesCollection.create(req)
		}
		
		res.status(201).send()
	}
)


// [PULL] Auth Required //
router.post(
	'/unvote/:_id',
	Auth.userTokenCheck(),
	async (req, res) => {
		const existance = await CommentsCollection.voterExistance(req)
		
		if (!existance) {
			await CommentsCollection.pullVoter(req)
			await CommentVotesCollection.delete(req)
		}
		
		res.status(201).send()
	}
)


/******************* [REPORTS] *******************/
router.post(
	'/report/:_id',
	Auth.userTokenCheck(),
	async (req, res) => {
		const existance = await ReportsCollection.existance(req)
		
		if (!existance) {
			await ReportsCollection.create(req)
			res.status(201).send()
		}
		else { res.status(400).send() }
	}
)

/******************* [EXISTANCE] *******************/
// WIP


/******************* [COUNT] *******************/
router.get(
	'/count/:block_id',
	async (req, res) => {
		const count = (await CommentsCollection.count(req)).toString()

		res.status(201).send(count)
	}
)


// [EXPORT] //
module.exports = router