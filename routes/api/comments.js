/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const jwt = require('jsonwebtoken')
const mongodb = require('mongodb')
require('dotenv').config()


// [REQUIRE] Personal //
const Collections = require('../../server-collections')
const CommentsCollection = require('../../server-collections/CommentsCollection')
const Auth = require('../../server-middleware/AuthMiddleware')
const CommentsM = require('../../server-middleware/CommentsMiddleware')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
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
	CommentsM.verifyOwnership(),
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
	CommentsM.verifyOwnership(),
	CommentsCollection.delete(),
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
	'/update/push-voter/:_id',
	Auth.userTokenCheck(),
	CommentsM.voterVerifyNonExistance(),
	CommentsCollection.pushVoter(),
	async (req, res) => { res.status(201).send() }
)


// [PULL] Auth Required //
router.post(
	'/update/pull-voter/:_id',
	Auth.userTokenCheck(),
	CommentsCollection.pullVoter(),
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