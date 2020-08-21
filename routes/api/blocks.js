/**
 * %%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
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
		const returned = await blocksCollection.c_create(
			req.decoded._id,
			req.body.cat_id,
			req.body.title
		)
		const returned2 = await commentsCollection.c_create(
			req.decoded._id,
			returned.createdBlock._id,
			req.body.text
		)

		res.status(201).send({
			status: true,
			created: [returned, returned2],
		})
	}
)


// [READ-ALL] Within Cat //
router.get(
	'/read-all/:cat_id/:amount/:skip',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		let returned = await blocksCollection.c_readAll(
			req.params.cat_id,
			req.params.skip,
			req.params.amount
		)
		
		if (returned.status) {
			// For Each Block in Blocks //
			for (let i = 0; i < returned.blocks.length; i++) {
				// Like Count //
				const likeCount = await blockLikesCollection.c_countAll(
					returned.blocks[i]._id
				)
	
				if (likeCount.status) { returned.blocks[i].likeCount = likeCount.count }	
				else { returned.blocks[i].likeCount = likeCount.message }
	
				
				// Follow Count //
				const followersCount = await blockFollowersCollection.c_countAll(
					returned.blocks[i]._id
				)
				
				if (followersCount.status) {
					returned.blocks[i].followersCount = followersCount.count
				}
				else { returned.blocks[i].followersCount = followersCount.message }
	
				
				// Comment Count //
				const commentCount = await commentsCollection.c_countAll(
					returned.blocks[i]._id
				)
				
				if (commentCount.status) {
					returned.blocks[i].commentCount = commentCount.count
				}
				else { returned.blocks[i].commentCount = commentCount.message }
	
				
				// Block Count //
				const blocksCount = await blocksCollection.c_countAll(req.params.cat_id)
	
				if (blocksCount.status) {
					returned.totalBlocks = blocksCount.count
				}
				else { returned.blocks[i].blocksCount = blocksCount.message }
	
				// If User Token Passed.. //
				if (req.decoded) {
					// Liked Status //
					const liked = await blockLikesCollection.c_existance(
						req.decoded._id,
						returned.blocks[i]._id
					)
	
					if (liked.status) { returned.blocks[i].liked = liked.existance }
					else { returned.blocks[i].liked = liked.message }
	
					// Follwed Status //
					const followed = await blockFollowersCollection.c_existance(
						req.decoded._id,
						returned.blocks[i]._id
					)
					
					if (followed.status) { returned.blocks[i].followed = followed.existance }
					else { returned.blocks[i].followed = followed.message }
				}
			}
		}

		res.status(200).send(returned)
	}
)


// [READ] Single Block //
router.get(
	'/read/:_id',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params._id)) {
			let returned = await blocksCollection.c_read(req.params._id)

			if (returned.status) {
				// Set Like Count //
				try {
					const count = await blockLikesCollection.c_countAll(
						returned.block._id
					)
	
					returned.block.likeCount = count.count
				}
				catch (e) { console.log(`Caught Error --> ${e}`) }
	
				// Follow Count //
				try {
					const count = await blockFollowersCollection.c_countAll(
						returned.block._id
					)
	
					returned.block.followersCount = count.count
				}
				catch (e) { console.log(`Caught Error --> ${e}`) }
	
				// If User Logged In.. //
				if (req.decoded) {
					// Liked Status //
					const liked = await blockLikesCollection.c_existance(
						req.decoded._id,
						returned.block._id
					)
	
					returned.block.liked = liked.existance
	
					// Follwed Status //
					const followed = await blockFollowersCollection.c_existance(
						req.decoded._id,
						returned.block._id
					)
	
					returned.block.followed = followed.existance
				}
			}

			res.status(200).send(returned)
		}
		else { res.status(200).send({ status: false, message: 'Invalid block_id' }) }
	},
)

// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.userToken(),
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params._id)) {
			const ownership = await blocksCollection.c_ownership(
				req.decoded._id,
				req.params._id
			)
			
			if (ownership.status && ownership.ownership) {
				const returned = await blocksCollection.c_delete(req.params._id)
				const returned2 = await blockLikesCollection.c_deleteAll(req.params._id)

				res.status(200).send({
					status: true,
					delete: [returned, returned2]
				})
				
			}
			else { res.status(200).send(ownership) }
		}
		else { res.status(200).send({ status: false, message: 'Invalid block_id' }) }
	},
)


/******************* [LIKE SYSTEM] *******************/
// [LIKE] Auth Required //
router.post(
	'/like/:_id',
	Auth.userToken(),
	rateLimiter.likeLimiter,
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params._id)) {
			// [CREATE] blockLike //
			const returned = await blockLikesCollection.c_create(
				req.decoded._id,
				req.params._id
			)
			
			res.status(201).send(returned)
		}
		else { res.status(200).send({ status: false, message: 'Invalid block_id' }) }

	},
)

// [UNLIKE] Auth Required //
router.post(
	'/unlike/:_id',
	rateLimiter.likeLimiter,
	Auth.userToken(),
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params._id)) {
			// [UPDATE] block Likers // [DELETE] blockLike //
			const returned = await blockLikesCollection.c_delete(
				req.decoded._id,
				req.params._id
			)
			
			res.status(201).send(returned)
		}
		else { res.status(200).send({ status: false, message: 'Invalid block_id' }) }
	},
)


/******************* [FOLLOW SYSTEM] *******************/
// [FOLLOW] Auth Required //
router.post(
	'/follow/:_id',
	Auth.userToken(),
	rateLimiter.followLimiter,
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params._id)) {
			const returned = await blockFollowersCollection.c_create(
				req.decoded._id,
				req.params._id
			)
			
			res.status(201).send(returned)
		}
		else { res.status(200).send({ status: false, message: 'Invalid block_id' }) }
	},
)

// [UNFOLLOW] Auth Required //
router.post(
	'/unfollow/:_id',
	rateLimiter.followLimiter,
	Auth.userToken(),
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params._id)) {
			const returned = await blockFollowersCollection.c_delete(
				req.decoded._id,
				req.params._id
			)
			
			res.status(201).send(returned)
		}
		else {
			res.status(200).send({
				status: false,
				message: 'Invalid block_id'
			})
		}
	},
)


/******************* [EXISTANCE] *******************/
// [EXISTANCE] //
router.get(
	'/existance/:_id',
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params._id)) {
			const returned = await blocksCollection.c_existance(req.params._id)

			if (returned.status) {
				if (returned.existance) { res.status(200).send(true) }
				else { res.status(200).send(false) }
			}
			else { res.status(200).send(returned) }
		}
		else {
			res.status(200).send({
				status: false,
				message: 'Invalid block_id'
			})
		}
	},
)


/******************* [COUNT] *******************/
router.get(
	'/count/:cat_id',
	async (req, res) => {
		const returned = await blocksCollection.c_countAll(req.params.cat_id)

		if (returned.status) { res.status(200).send(returned.count.toString()) }
		else { res.status(200).send(returned.message.toString()) }
	},
)


// [EXPORT] //
module.exports = router