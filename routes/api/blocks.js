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
const CommentsCollection = require('../../server-collections/CommentsCollection')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userToken(),
	async (req, res) => {
		const returnedData = await BlocksCollection.c_create(
			req.decoded._id,
			req.body.cat_id,
			req.body.title
		)
		const returnedData2 = await CommentsCollection.c_create(
			req.decoded._id,
			returnedData.createdBlock._id,
			req.body.text
		)

		res.status(201).send([returnedData, returnedData2])
	}
)


// [READ-ALL] Within Cat //
router.get(
	'/read-all/:cat_id/:amount/:skip',
	async (req, res) => {
		const returnedData = await BlocksCollection.c_readAll(
			req.params.cat_id,
			req.params.skip,
			req.params.amount
		)

		res.status(200).send(returnedData)
	}
)


// [READ] Single Block //
router.get(
	'/read/:_id',
	async (req, res) => {
		const returnedData = await BlocksCollection.c_read(req.params._id)

		res.status(200).send(returnedData)
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.userToken(),
	async (req, res) => {
		const ownership = await BlocksCollection.c_ownership(
			req.decoded._id,
			req.params._id
		)
		
		if (ownership.status && ownership.ownership) {
			const returnedData = await BlocksCollection.c_delete(req.params._id)
			const returnedData2 = await BlockLikesCollection.c_deleteAll(req.params._id)

			res.status(200).send([returnedData, returnedData2])
			
		}
		else { res.status(400).send(ownership.message) }
	}
)


/******************* [LIKE SYSTEM] *******************/
// [LIKE] Auth Required //
router.post(
	'/like/:_id',
	Auth.userToken(),
	async (req, res) => {
		// [UPDATE] block's Likers // [CREATE] blockLike //
		const returnedData = await BlocksCollection.c_like(
			req.decoded._id,
			req.params._id
		)
		const returnedData2 = await BlockLikesCollection.c_create(
			req.decoded._id,
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
		// [UPDATE] block Likers // [DELETE] blockLike //
		const returnedData = await BlocksCollection.c_unlike(
			req.decoded._id,
			req.params._id
		)
		const returnedData2 = await BlockLikesCollection.c_delete(
			req.decoded._id,
			req.params._id
		)
		
		res.status(201).send([returnedData, returnedData2])
	}
)


/******************* [FOLLOW SYSTEM] *******************/
// [FOLLOW] Auth Required //
router.post(
	'/follow/:_id',
	Auth.userToken(),
	async (req, res) => {
		// [UPDATE] block Followers // [CREATE] blockFollow //
		const returnedData = await BlocksCollection.c_follow(
			req.decoded._id,
			req.params._id
		)
		const returnedData2 = await BlockFollowsCollection.c_create(
			req.decoded._id,
			req.params._id
		)
		
		res.status(201).send([returnedData, returnedData2])
	}
)


// [UNFOLLOW] Auth Required //
router.post(
	'/unfollow/:_id',
	Auth.userToken(),
	async (req, res) => {
		// [UPDATE] block Followers // [DELETE] blockFollow //
		const returnedData = await BlocksCollection.c_unfollow(
			req.decoded._id,
			req.params._id
		)
		const returnedData2 = await BlockFollowsCollection.c_delete(
			req.decoded._id,
			req.params._id
		)
		
		res.status(201).send([returnedData, returnedData2])
	}
)


/******************* [EXISTANCE + OWNERSHIP] *******************/
// [EXISTANCE] //
router.get(
	'/existance/:_id',
	async (req, res) => {
		const existance = await BlocksCollection.c_existance(req.params._id)

		if (existance.status) {
			if (existance.existance) { res.status(200).send(true) }
			else { res.status(200).send(false) }
		}
		else { res.status(400).send(existance.message) }
	}
)


// [OWNERSHIP] //
router.get(
	'/ownership/:_id',
	Auth.userToken(),
	async (req, res) => {
		const ownership = await BlocksCollection.c_ownership(
			req.decoded._id,
			req.params._id
		)

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
		const count = (await BlocksCollection.c_count(req.params.cat_id))

		res.status(200).send(count.toString())
	}
)


// [EXPORT] //
module.exports = router