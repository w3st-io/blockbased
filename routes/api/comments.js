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
const CommentsCollection = require('../../server-collections/CommentsCollection')
const CommentVotesCollection = require('../../server-collections/CommentVotesCollection')
const Auth = require('../../server-middleware/AuthMiddleware')
const CommentsMiddleware = require('../../server-middleware/CommentsMiddleware')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userTokenCheck(),
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
	CommentsMiddleware.verifyOwnership(),
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
	CommentsMiddleware.verifyOwnership(),
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
	CommentsMiddleware.voterVerifyNonExistance(),
	CommentsCollection.pushVoter(),
	CommentVotesCollection.create(),
	async (req, res) => { res.status(201).send() }
)


// [PULL] Auth Required //
router.post(
	'/unvote/:_id',
	Auth.userTokenCheck(),
	CommentsCollection.pullVoter(),
	CommentVotesCollection.delete(),
	async (req, res) => { res.status(201).send() }
)


/******************* [VALIDATE] *******************/
// WIP


/******************* [COUNT] *******************/
router.get(
	'/count/:block_id',
	CommentsCollection.count(),
	async (req, res) => { res.status(201).send(req.count.toString()) }
)


// [EXPORT] //
module.exports = router