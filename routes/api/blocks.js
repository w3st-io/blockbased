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
const BlocksCollection = require('../../server-collections/BlocksCollection')
const BlockVotesCollection = require('../../server-collections/BlockVotesCollection')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userTokenCheck(),
	BlocksCollection.create(),
	async (req, res) => {
		res.status(201).send({
			auth: true,
			message: 'Created block.'
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
	'/read/:_id',
	BlocksCollection.read(),
	async (req, res) => { res.send(req.retrievedData) }
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.userTokenCheck(),
	BlocksCollection.verifyOwnership(),
	BlocksCollection.delete(),
	async (req, res) => {
		res.status(200).send({
			auth: true,
			message: 'Deleted block.'
		})
	}
)


/******************* [VOTE SYSTEM] *******************/
// [PUSH] Auth Required //
router.post(
	'/vote/:_id',
	Auth.userTokenCheck(),
	BlocksCollection.voterExistance(true),
	BlocksCollection.pushVoter(),
	BlockVotesCollection.create(),
	async (req, res) => { res.status(201).send() }
)


// [PULL] Auth Required //
router.post(
	'/unvote/:_id',
	Auth.userTokenCheck(),
	BlocksCollection.pullVoter(),
	BlockVotesCollection.delete(),
	async (req, res) => { res.status(201).send() }
)


/******************* [VALIDATE] *******************/
router.get(
	'/validate/:_id',
	async (req, res) => {
		// If Existance True/False Check //
		let existance = await BlocksCollection.existance(req.params._id, true)

		if (existance == true) { res.status(200).send(true) }
		else { res.status(400).send(false) }
	},
)


// Check Block Ownership (Should be Used only on the client //
router.get(
	'/verify-ownership/:_id',
	Auth.userTokenCheck(),
	BlocksCollection.verifyOwnership(),
)


/******************* [COUNT] *******************/
router.get(
	'/count/:cat_id',
	BlocksCollection.count(),
)


// [EXPORT] //
module.exports = router