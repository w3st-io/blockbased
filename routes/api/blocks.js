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
const rateLimiter = require('../../rate-limiters')
const blocksCollection = require('../../server-collections/blocksCollection')
const blockFollowsCollection = require('../../server-collections/blockFollowsCollection')
const blockLikesCollection = require('../../server-collections/blockLikesCollection')
const commentsCollection = require('../../server-collections/commentsCollection')
const Auth = require('../../server-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userToken(),
	rateLimiter.blockLimiter,
	async (req, res) => {
		const returnedData = await blocksCollection.c_create(
			req.decoded._id,
			req.body.cat_id,
			req.body.title
		)
		const returnedData2 = await commentsCollection.c_create(
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
	Auth.userTokenNotRequired(),
	async (req, res) => {
		const blocks = await blocksCollection.c_readAll(
			req.params.cat_id,
			req.params.skip,
			req.params.amount
		)

		// For Each Block in Blocks //
		for (let i = 0; i < blocks.length; i++) {
			// Set Like Count //
			try {
				blocks[i].likeCount = await blockLikesCollection.c_countAll(
					blocks[i]._id
				)
			}
			catch (e) { console.log(`Caught Error --> ${e}`) }

			// Set Liked Status //
			if (req.decoded) {
				// check if the block like exist..
				const liked = await blockLikesCollection.c_existance(
					req.decoded._id,
					blocks[i]._id
				)
					
				blocks[i].liked = liked.existance
			}
		}
	
		res.status(200).send(blocks)
	}
)


// [READ] Single Block //
router.get(
	'/read/:_id',
	async (req, res) => {
		const block = await blocksCollection.c_read(req.params._id)

		// Set Like Count //
		try { block.likeCount = await blockLikesCollection.c_countAll(block._id) }
		catch (e) { console.log(`Caught Error --> ${e}`) }

		// Set Liked Status //
		if (req.decoded) {
			// check if the block like exist..
			const liked = await blockLikesCollection.c_existance(
				req.decoded._id,
				block._id
			)

			block.liked = liked.existance
		}

		res.status(200).send(block)
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.userToken(),
	async (req, res) => {
		const ownership = await blocksCollection.c_ownership(
			req.decoded._id,
			req.params._id
		)
		
		if (ownership.status && ownership.ownership) {
			const returnedData = await blocksCollection.c_delete(req.params._id)
			const returnedData2 = await blockLikesCollection.c_deleteAll(req.params._id)

			res.status(200).send([returnedData, returnedData2])
			
		}
		else { res.status(400).send(ownership) }
	}
)


/******************* [LIKE SYSTEM] *******************/
// [LIKE] Auth Required //
router.post(
	'/like/:_id',
	Auth.userToken(),
	rateLimiter.likeLimiter,
	async (req, res) => {
		// [CREATE] blockLike //
		const returnedData = await blockLikesCollection.c_create(
			req.decoded._id,
			req.params._id
		)
		
		res.status(201).send(returnedData)
	}
)


// [UNLIKE] Auth Required //
router.post(
	'/unlike/:_id',
	rateLimiter.likeLimiter,
	Auth.userToken(),
	async (req, res) => {
		// [UPDATE] block Likers // [DELETE] blockLike //
		const returnedData = await blockLikesCollection.c_delete(
			req.decoded._id,
			req.params._id
		)
		
		res.status(201).send(returnedData)
	}
)


/******************* [FOLLOW SYSTEM] *******************/
// [FOLLOW] Auth Required //
router.post(
	'/follow/:_id',
	Auth.userToken(),
	rateLimiter.followLimiter,
	async (req, res) => {
		// [UPDATE] block Followers // [CREATE] blockFollow //
		const returnedData = await blocksCollection.c_follow(
			req.decoded._id,
			req.params._id
		)
		const returnedData2 = await blockFollowsCollection.c_create(
			req.decoded._id,
			req.params._id
		)
		
		res.status(201).send([returnedData, returnedData2])
	}
)


// [UNFOLLOW] Auth Required //
router.post(
	'/unfollow/:_id',
	rateLimiter.followLimiter,
	Auth.userToken(),
	async (req, res) => {
		// [UPDATE] block Followers // [DELETE] blockFollow //
		const returnedData = await blocksCollection.c_unfollow(
			req.decoded._id,
			req.params._id
		)
		const returnedData2 = await blockFollowsCollection.c_delete(
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
		const existance = await blocksCollection.c_existance(req.params._id)

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
		const ownership = await blocksCollection.c_ownership(
			req.decoded._id,
			req.params._id
		)

		if (ownership.status) {
			if (ownership.ownership) { res.status(200).send(true) }
			else { res.status(200).send(false) }
		}
		else { res.status(400).send(ownership) }
	}
)


/******************* [COUNT] *******************/
router.get(
	'/count/:cat_id',
	async (req, res) => {
		const count = (await blocksCollection.c_count(req.params.cat_id))

		res.status(200).send(count.toString())
	}
)


// [EXPORT] //
module.exports = router