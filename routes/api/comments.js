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
	async (req, res, next) => { 
		if (req.body.block_id) {
			const existance = await BlocksCollection.existance(req.body.block_id, true)

			if (existance == true) { next() }
			else { res.status(400).send() }
		}
		else { res.status(400).send() }
	},
	CommentsCollection.create(),
	async (req, res) => {
		res.status(201).send({
			auth: true,
			message: 'Created Comment'
		})
	}
)


// [READ-ALL] //
router.get(
	'/read-all/:block_id/:amountPerPage/:skip',
	CommentsCollection.readAll(),
	async (req, res) => { res.status(201).send(req.retrievedData) }
)


// [READ] //
router.get(
	'/read/:_id',
	CommentsCollection.read(),
	async (req, res) => { res.status(201).send(req.retrievedData) }
)


// [UPDATE] Auth Required //
router.post(
	'/update/:_id',
	Auth.userTokenCheck(),
	CommentsCollection.verifyOwnership(),
	CommentsCollection.update(),
	async (req, res) => {
		res.status(201).send({
			auth: true,
			message: 'Successfully Updated Comment'
		})
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.userTokenCheck(),
	CommentsCollection.verifyOwnership(),
	CommentsCollection.delete(),
	CommentVotesCollection.deleteAll(),
	async (req, res) => {
		res.status(201).send({
			auth: true,
			message: 'Successfully Deleted Comment'
		})
	}
)


/******************* [VOTE SYSTEM] *******************/
// [PUSH] Auth Required //
router.post(
	'/vote/:_id/:block_id',
	Auth.userTokenCheck(),
	CommentsCollection.voterExistance(false),
	CommentsCollection.pushVoter(),
	CommentVotesCollection.create(),
	async (req, res) => { res.status(201).send() }
)


// [PULL] Auth Required //
router.post(
	'/unvote/:_id',
	Auth.userTokenCheck(),
	CommentsCollection.voterExistance(true),
	CommentsCollection.pullVoter(),
	CommentVotesCollection.delete(),
	async (req, res) => { res.status(201).send() }
)


/******************* [REPORTS] *******************/
router.post(
	'/report/:_id',
	Auth.userTokenCheck(),
	ReportsCollection.existance(false),
	ReportsCollection.create(),
	async (req, res) => { res.status(201).send() }
)

/******************* [EXISTANCE] *******************/
// WIP


/******************* [COUNT] *******************/
router.get(
	'/count/:block_id',
	CommentsCollection.count(),
	async (req, res) => { res.status(201).send(req.count.toString()) }
)


// [EXPORT] //
module.exports = router