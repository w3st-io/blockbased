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
	async (req, res) => {
		await BlocksCollection.create(req)

		res.status(201).send()
	}
)


// [READ ALL] Within Cat //
router.get(
	'/read-all/:cat_id/:amountPerPage/:skip',
	async (req, res) => {
		const returnedData = await BlocksCollection.readAll(req)
		res.status(200).send(returnedData)
	}
)


// [READ] Single Block //
router.get(
	'/read/:_id',
	async (req, res) => {
		const returnedData = await BlocksCollection.read(req)
		res.status(200).send(returnedData)
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.userTokenCheck(),
	async (req, res) => {
		const owned = await BlocksCollection.verifyOwnership(true, req)
		
		if (owned == true) {
			await BlocksCollection.delete(req)
			res.status(200).send()
		}
		else { res.status(400).send() }
	}
)


/******************* [VOTE SYSTEM] *******************/
// [PUSH] Auth Required //
router.post(
	'/vote/:_id',
	Auth.userTokenCheck(),
	async (req, res) => {
		const voteExistance = await BlocksCollection.voteExistance(req)
		
		if (voteExistance == true) {
			await BlocksCollection.pushVoter(req)
			await BlockVotesCollection.create(req)
			
			res.status(201).send()
		}
		else { res.status(400).send() }
	}
)


// [PULL] Auth Required //
router.post(
	'/unvote/:_id',
	Auth.userTokenCheck(),
	async (req, res) => {
		const voteExistance = await BlocksCollection.voteExistance(req)
		
		if (voteExistance == true) {
			await BlocksCollection.pullVoter(req)
			await BlockVotesCollection.delete(req)
			
			res.status(201).send()
		}
		else { res.status(400).send() }
	}
)


/******************* [VALIDATE] *******************/
router.get(
	'/existance/:_id',
	async (req, res) => {
		// If Existance True/False Check //
		const existance = await BlocksCollection.existance(req.params._id)

		if (existance == true) { res.status(200).send(true) }
		else { res.status(400).send(false) }
	},
)


// Check Block Ownership (should be used only on the client) //
router.get(
	'/ownership/:_id',
	Auth.userTokenCheck(),
	async (req, res) => {
		const owned = await BlocksCollection.verifyOwnership(true, req)

		if (owned == true) { res.status(200).send(true) }
		else { res.status(200).send(false) }
	}
)


/******************* [COUNT] *******************/
router.get(
	'/count/:cat_id',
	async (req, res) => {
		const count = (await BlocksCollection.count(req)).toString()

		res.status(200).send(count)
	}
)


// [EXPORT] //
module.exports = router