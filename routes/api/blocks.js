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
const blockFollowersCollection = require('../../server-collections/blockFollowersCollection')
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

		const created = {
			status: true,
			created: [returnedData, returnedData2],
		}

		res.status(201).send(created)
	}
)


// [READ-ALL] Within Cat //
router.get(
	'/read-all/:cat_id/:amount/:skip',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		const returnedData = await blocksCollection.c_readAll(
			req.params.cat_id,
			req.params.skip,
			req.params.amount
		)

		// For Each Block in Blocks //
		for (let i = 0; i < returnedData.blocks.length; i++) {
			// Like Count //
			try {
				returnedData.blocks[i].likeCount = await blockLikesCollection.c_countAll(
					returnedData.blocks[i]._id
				)
			}
			catch (e) { console.log(`Caught Error --> ${e}`) }

			// Follow Count //
			try {
				const count = await blockFollowersCollection.c_countAll(
					returnedData.blocks[i]._id
				)

				returnedData.blocks[i].followersCount = count
			}
			catch (e) { console.log(`Caught Error --> ${e}`) }

			// If User Logged In.. //
			if (req.decoded) {
				// Liked Status //
				const liked = await blockLikesCollection.c_existance(
					req.decoded._id,
					returnedData.blocks[i]._id
				)
					
				returnedData.blocks[i].liked = liked.existance

				// Follwed Status //
				const followed = await blockFollowersCollection.c_existance(
					req.decoded._id,
					returnedData.blocks[i]._id
				)
				
				returnedData.blocks[i].followed = followed.existance
			}
		}
	
		res.status(200).send(returnedData)
	}
)


// [READ] Single Block //
router.get(
	'/read/:_id',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		let returnedData = await blocksCollection.c_read(req.params._id)

		// Set Like Count //
		try {
			returnedData.block.likeCount = await blockLikesCollection.c_countAll(
				returnedData.block._id
			)
		}
		catch (e) { console.log(`Caught Error --> ${e}`) }

		// Follow Count //
		try {
			returnedData.block.followersCount = await blockFollowersCollection.c_countAll(
				returnedData.block._id
			)
		}
		catch (e) { console.log(`Caught Error --> ${e}`) }

		// If User Logged In.. //
		if (req.decoded) {
			// Liked Status //
			const liked = await blockLikesCollection.c_existance(
				req.decoded._id,
				returnedData.block._id
			)

			returnedData.block.liked = liked.existance

			// Follwed Status //
			try {
				const followed = await blockFollowersCollection.c_existance(
					req.decoded._id,
					returnedData.block._id
				)

				returnedData.block.followed = followed.existance
			}
			catch (e) { console.log(e) }
		}

		res.status(200).send(returnedData)
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
		const returnedData = await blockFollowersCollection.c_create(
			req.decoded._id,
			req.params._id
		)
		
		res.status(201).send(returnedData)
	}
)


// [UNFOLLOW] Auth Required //
router.post(
	'/unfollow/:_id',
	rateLimiter.followLimiter,
	Auth.userToken(),
	async (req, res) => {
		const returnedData = await blockFollowersCollection.c_delete(
			req.decoded._id,
			req.params._id
		)
		
		res.status(201).send(returnedData)
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