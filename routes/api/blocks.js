/**
 * %%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
require('dotenv').config()


// [REQUIRE] Personal //
const Auth = require('../../server-middleware/AuthMiddleware')
const BlocksM = require('../../server-middleware/BlocksMiddleware')
const BlocksCollection = require('../../server-collections/BlocksCollection')
const BlockVotesCollections = require('../../server-collections/BlockVotesCollection')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userTokenCheck(),
	BlocksCollection.create(),
	async (req, res) => {
		res.status(201).send({
			auth: true,
			message: 'Created block'
		})
	}
)


// [READ ALL] Within Cat //
router.get(
	'/read-all/:cat_id/:amountPerPage/:skip',
	BlocksCollection.readAll(),
	async (req, res) => { res.send(req.retrievedData) }
)


// [READ] Single Block //
router.get(
	'/read/:block_id',
	BlocksCollection.read(),
	async (req, res) => { res.send(req.retrievedData) }
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.userTokenCheck(),
	BlocksM.verifyOwnership(),
	BlocksCollection.delete(),
	async (req, res) => {
		res.status(201).send({
			auth: true,
			message: 'Deleted block'
		})
	}
)


/******************* [VOTE SYSTEM] *******************/
// [PUSH] Auth Required //
router.post(
	'/vote/:_id',
	Auth.userTokenCheck(),
	BlocksM.voterVerifyNonExistance(),
	BlocksCollection.pushVoter(),
	BlockVotesCollections.create(),
	async (req, res) => { res.status(201).send() }
)


// [PULL] Auth Required //
router.post(
	'/unvote/:_id',
	Auth.userTokenCheck(),
	BlocksCollection.pullVoter(),
	BlockVotesCollections.delete(),
	async (req, res) => { res.status(201).send() }
)


/******************* [VALIDATE] *******************/
router.get(
	'/validate/:_id',
	BlocksCollection.validate(),
	async (req, res) => { res.status(201).send(true) }
)


// Check Block Ownership (Should be Used only on the client //
router.get(
	'/verify-ownership/:_id',
	BlocksM.verifyOwnership(),
	BlocksCollection.verifyOwnership(),
	async (req, res) => { res.status(201).send(existance) }
)


/******************* [COUNT] *******************/
router.get(
	'/count/:cat_id',
	BlocksCollection.count(),
	async (req, res) => { res.status(201).send(req.count.toString()) }
)


// [EXPORT] //
module.exports = router