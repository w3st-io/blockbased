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
const BlockAuth = require('../../server-middleware/BlockAuthMiddleware')
const Collections = require('../../server-collections')


// [INIT] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userCheck(),
	async (req, res) => {
		if (req.body.user_id == req.decoded._id) {
			const blocks = await Collections.loadBlocksCollection()
			await blocks.insertOne({
				createdAt: new Date(),
				cat_id: req.body.cat_id,
				user_id: req.body.user_id,
				email: req.body.email,
				username: req.body.username,
				title: req.body.title,
				voters: [],
			})

			res.status(201).send({
				auth: true,
				message: 'Created block'
			})
		}
		else {
			res.status(401).send({
				auth: false,
				error: 'Bro you cant create a block for someone else!'
			})
		}
	}
)


// [READ ALL] //
router.get('/read-all/:cat_id/:amountPerPage/:skip', async (req, res) => {
	let skip = parseInt(req.params.skip)
	let amountPerPage = parseInt(req.params.amountPerPage)
	
	const blocks = await Collections.loadBlocksCollection()
	let retrievedData = await blocks.find(
		{ cat_id: req.params.cat_id }
	)
		.skip(skip)
		.limit(amountPerPage)
		.toArray()

	res.send(retrievedData)
})


// [READ] This for Single Block Details //
router.get(`/read/:block_id`, async (req, res) => {
	const blocks = await Collections.loadBlocksCollection()
	let retrievedData = await blocks.findOne(
		{ _id: new mongodb.ObjectID(req.params.block_id) }
	)

	res.send(retrievedData)
})


/******************* [VOTE SYSTEM] *******************/
// [PUSH] Auth Required //
router.post(
	'/update/push-voter/:_id',
	Auth.userCheck(),
	async (req, res) => {
		if (req.body.user_id == req.decoded._id) {
			const blocks = await Collections.loadBlocksCollection()
			await blocks.updateOne(
				{ _id: new mongodb.ObjectID(req.params._id) },
				{ $push:
					{ 
						voters: {
							user_id: req.body.user_id,
							email: req.body.email,
							username: req.body.username,
						} 
					}
				},
				{ upsert: true }
			)

			res.status(201).send()
		}
		else {
			res.status(401).send({
				auth: false,
				error: 'Bro you cant add blockVote for someone else!'
			})
		}
	}
)


// [PULL] Auth Required //
router.post(
	'/update/pull-voter/:_id',
	Auth.userCheck(),
	async (req, res) => {
		if (req.body.user_id == req.decoded._id) {
			const blocks = await Collections.loadBlocksCollection()
			await blocks.updateOne(
				{ _id: new mongodb.ObjectID(req.params._id) },
				{ $pull: { voters: { user_id: req.body.user_id } } },
				{ upsert: true }
			)

			res.status(201).send()
		}
		else {
			res.status(401).send({
				auth: false,
				error: 'Bro you cant remove blockVote for someone else!'
			})
		}
	}
)


/******************* [VALIDATION] *******************/
// Check ig Block Exists //
router.get('/validate/:_id', async (req, res) => {
	if (mongodb.ObjectID.isValid(req.params._id)) {
		const blocks = await Collections.loadBlocksCollection()

		let retrievedData = await blocks.findOne(
			{ _id: new mongodb.ObjectID(req.params._id) }
		)

		if (retrievedData) { existance = true }

		res.status(201).send(existance)
	}
	else { res.status(400).send({ error: 'Invalid Token' }) }
})


/******************* [COUNT] *******************/
router.get('/count/:cat_id', async (req, res) => {
	const blocks = await Collections.loadBlocksCollection()
	try {
		const count = await blocks.countDocuments(
			{ cat_id: req.params.cat_id }
		)
		res.status(201).send(count.toString())
	}
	catch(e) { res.send(e) }
})


// [EXPORT] //
module.exports = router