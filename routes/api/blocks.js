/**
 * %%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongodb = require('mongodb')
require('dotenv').config()


// [REQUIRE] Personal //
const Auth = require('../../server-middleware/AuthMiddleware')
const BlocksM = require('../../server-middleware/BlocksMiddleware')
const Collections = require('../../server-collections')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userTokenCheck(),
	async (req, res) => {
		const blocks = await Collections.loadBlocksCollection()
		await blocks.insertOne({
			createdAt: new Date(),
			cat_id: req.body.cat_id,
			title: req.body.title,
			voters: [],
			user_id: req.decoded._id,
			email: req.decoded.email,
			username: req.decoded.username,
		})

		res.status(201).send({
			auth: true,
			message: 'Created block'
		})
	}
)


// [READ ALL] //
router.get(
	'/read-all/:cat_id/:amountPerPage/:skip',
	async (req, res) => {
		let skip = parseInt(req.params.skip)
		let amountPerPage = parseInt(req.params.amountPerPage)
		
		const blocks = await Collections.loadBlocksCollection()
		let retrievedData = await blocks.find({ cat_id: req.params.cat_id })
			.skip(skip)
			.limit(amountPerPage)
			.toArray()

		res.send(retrievedData)
	}
)


// [READ] This for Single Block Details //
router.get(
	'/read/:block_id',
	async (req, res) => {
		const blocks = await Collections.loadBlocksCollection()
		let retrievedData = await blocks.findOne(
			{ _id: new mongodb.ObjectID(req.params.block_id) }
		)

		res.send(retrievedData)
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.userTokenCheck(),
	BlocksM.verifyOwnership(),
	async (req, res) => {
		const blocks = await Collections.loadBlocksCollection()
		/*await blocks.deleteOne({
			_id: new mongodb.ObjectID(req.params.block_id),
			user_id: req.decoded._id,
		})*/

		res.status(201).send({
			auth: true,
			message: 'Deleted block'
		})
	}
)


/******************* [VOTE SYSTEM] *******************/
// [PUSH] Auth Required //
router.post(
	'/update/push-voter/:_id',
	Auth.userTokenCheck(),
	BlocksM.voterVerifyNonExistance(),
	async (req, res) => {
		const blocks = await Collections.loadBlocksCollection()
		await blocks.updateOne(
			{ _id: new mongodb.ObjectID(req.params._id) },
			{ $push:
				{ 
					voters: {
						user_id: req.decoded._id,
						email: req.decoded.email,
						username: req.decoded.username,
					} 
				}
			},
			{ upsert: true }
		)

		res.status(201).send()
	}
)


// [PULL] Auth Required //
router.post(
	'/update/pull-voter/:_id',
	Auth.userTokenCheck(),
	async (req, res) => {
		const blocks = await Collections.loadBlocksCollection()
		await blocks.updateOne(
			{ _id: new mongodb.ObjectID(req.params._id) },
			{ $pull: { voters: { user_id: req.decoded._id } } },
			{ upsert: true }
		)

		res.status(201).send()
	}
)


/******************* [VALIDATION] *******************/
// Check Block Exists //
router.get(
	'/validate/:_id',
	async (req, res) => {
		if (mongodb.ObjectID.isValid(req.params._id)) {
			const blocks = await Collections.loadBlocksCollection()

			let retrievedData = await blocks.findOne(
				{ _id: new mongodb.ObjectID(req.params._id) }
			)

			if (retrievedData) { existance = true }

			res.status(201).send(existance)
		}
		else { res.status(400).send({ error: 'Invalid Token' }) }
	}
)


// Check Block Ownership (Should be Used only on the client) //
router.get(
	'/verify-ownership/:_id',
	BlocksM.verifyOwnership(),
	async (req, res) => {
		existance = true
		res.status(201).send(existance)
	}
)


/******************* [COUNT] *******************/
router.get(
	'/count/:cat_id',
	async (req, res) => {
		const blocks = await Collections.loadBlocksCollection()
		try {
			const count = await blocks.countDocuments(
				{ cat_id: req.params.cat_id }
			)
			res.status(201).send(count.toString())
		}
		catch(e) { res.send(e) }
	}
)


// [EXPORT] //
module.exports = router