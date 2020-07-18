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
const BlockFollowsCollection = require('../../server-collections/BlockFollowsCollection')
const BlockLikesCollection = require('../../server-collections/BlockLikesCollection')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userToken(),
	async (req, res) => {
		const user_id = req.decoded._id
		const cat_id = req.body.cat_id
		const title = req.body.title

		const returnedData = await BlocksCollection.create(user_id, cat_id, title)

		res.status(201).send(returnedData)
	}
)


// [READ-ALL] Within Cat //
router.get(
	'/read-all/:cat_id/:amount/:skip',
	async (req, res) => {
		const cat_id = req.params.cat_id
		const skip = req.params.skip
		const amount = req.params.amount

		const returnedData = await BlocksCollection.readAll(cat_id, skip, amount)

		res.status(200).send(returnedData)
	}
)


// [READ] Single Block //
router.get(
	'/read/:_id',
	async (req, res) => {
		const block_id = req.params._id

		const returnedData = await BlocksCollection.read(block_id)

		res.status(200).send(returnedData)
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.userToken(),
	async (req, res) => {
		const user_id = req.decoded._id
		const block_id = req.params._id

		const ownership = await BlocksCollection.ownership(user_id, block_id)
		
		if (ownership.status && ownership.ownership) {
			const returnedData = await BlocksCollection.delete(block_id)
			const returnedData2 = await BlockLikesCollection.deleteAll(block_id)

			res.status(200).send([returnedData, returnedData2])
			
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
		const user_id = req.decoded._id
		const block_id = req.params._id

		// [UPDATE] block's Likers // [CREATE] blockLike //
		const returnedData = await BlocksCollection.like(user_id, block_id)
		const returnedData2 = await BlockLikesCollection.create(user_id, block_id)
		
		res.status(201).send([returnedData, returnedData2])
	}
)


// [UNLIKE] Auth Required //
router.post(
	'/unlike/:_id',
	Auth.userToken(),
	async (req, res) => {
		const user_id = req.decoded._id
		const block_id = req.params._id

		// [UPDATE] block Likers // [DELETE] blockLike //
		const returnedData = await BlocksCollection.unlike(user_id, block_id)
		const returnedData2 = await BlockLikesCollection.delete(user_id, block_id)
		
		res.status(201).send([returnedData, returnedData2])
	}
)


/******************* [FOLLOW SYSTEM] *******************/
// [FOLLOW] Auth Required //
router.post(
	'/follow/:_id',
	Auth.userToken(),
	async (req, res) => {
		const user_id = req.decoded._id
		const block_id = req.params._id

		// [UPDATE] block Followers // [CREATE] blockFollow //
		const returnedData = await BlocksCollection.follow(user_id, block_id)
		const returnedData2 = await BlockFollowsCollection.create(user_id, block_id)
		
		res.status(201).send([returnedData, returnedData2])
	}
)


// [UNFOLLOW] Auth Required //
router.post(
	'/unfollow/:_id',
	Auth.userToken(),
	async (req, res) => {
		const user_id = req.decoded._id
		const block_id = req.params._id

		// [UPDATE] block Followers // [DELETE] blockFollow //
		const returnedData = await BlocksCollection.unfollow(user_id, block_id)
		const returnedData2 = await BlockFollowsCollection.delete(user_id, block_id)
		
		res.status(201).send([returnedData, returnedData2])
	}
)


/******************* [EXISTANCE + OWNERSHIP] *******************/
// [EXISTANCE] //
router.get(
	'/existance/:_id',
	async (req, res) => {
		const block_id = req.params._id

		const existance = await BlocksCollection.existance(block_id)

		if (existance.status) {
			if (existance.existance) { res.status(200).send(true) }
			else { res.status(200).send(false) }
		}
		else { res.send(400).send(existance.message) }
	},
)


// [OWNERSHIP] //
router.get(
	'/ownership/:_id',
	Auth.userToken(),
	async (req, res) => {
		const user_id = req.decoded._id
		const block_id = req.params._id

		const ownership = await BlocksCollection.ownership(user_id, block_id)

		if (ownership.status) {
			if (ownership.ownership) { res.status(200).send(true) }
			else { res.status(200).send(false) }
		}
		else { res.status(400).send(ownership.message) }
	}
)


/******************* [COUNT] *******************/
router.get(
	'/count/:cat_id',
	async (req, res) => {
		const cat_id = req.params.cat_id

		const count = (await BlocksCollection.count(cat_id))

		res.status(200).send(count.toString())
	}
)


// [EXPORT] //
module.exports = router