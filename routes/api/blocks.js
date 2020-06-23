/**
 * %%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongodb = require('mongodb')


// [REQUIRE] Personal //
const Auth = require("../../auth/AuthMiddleware")
require('dotenv').config()


// [INIT] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] //
router.post('/create', Auth.userCheck(), async (req, res) => {
	const blocks = await loadBlocksCollection()
	await blocks.insertOne({
		createdAt: new Date(),
		cat_id: req.body.cat_id,
		user_id: req.body.user_id,
		email: req.body.email,
		username: req.body.username,
		title: req.body.title,
		voters: [],
	})

	res.status(201).send()
})


// [READ ALL] //
router.get('/read-all/:cat_id/:amountPerPage/:skip', async (req, res) => {
	let skip = parseInt(req.params.skip)
	let amountPerPage = parseInt(req.params.amountPerPage)
	
	const blocks = await loadBlocksCollection()
	let retrievedData = await blocks.find(
		{ cat_id: req.params.cat_id }
	)
		.skip(skip)
		.limit(amountPerPage)
		.toArray()

	res.send(retrievedData)
})


// [READ] // This for Single Block Details //
router.get(`/read/:block_id`, async (req, res) => {
	const blocks = await loadBlocksCollection()
	let retrievedData = await blocks.findOne(
		{ _id: new mongodb.ObjectID(req.params.block_id) }
	)

	res.send(retrievedData)
})


/******************* [VOTE SYSTEM] *******************/
// [VOTERS] PUSH + PULL //
router.post(
	'/update/push-voter/:_id',
	Auth.userCheck(),
	async (req, res) => {
	const blocks = await loadBlocksCollection()
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
)
router.post(
	'/update/pull-voter/:_id',
	Auth.userCheck(),
	async (req, res) => {
		const blocks = await loadBlocksCollection()
		await blocks.updateOne(
			{ _id: new mongodb.ObjectID(req.params._id) },
			{ $pull: { voters: { user_id: req.body.user_id } } },
			{ upsert: true }
		)

		res.status(201).send()
	}
)


/******************* [VALIDATION] *******************/
router.get('/validate/:_id', async (req, res) => {
	let existance = mongodb.ObjectID.isValid(req.params._id)

	if (existance) {
		const blocks = await loadBlocksCollection()

		let retrievedData = await blocks.findOne(
			{ _id: new mongodb.ObjectID(req.params._id) }
		)

		if (retrievedData) { existance = true }

		res.status(201).send(existance)
	}
	else { res.sendStatus(400) }
})


/******************* [COUNT] *******************/
router.get('/count/:cat_id', async (req, res) => {
	const blocks = await loadBlocksCollection()

	try {
		const count = await blocks.countDocuments(
			{ cat_id: req.params.cat_id }
		)

		res.status(201).send(count.toString())
	}
	catch(e) { res.send(e) }
})


/******************* [LOAD COLLECTION] blocks *******************/
async function loadBlocksCollection() {
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'db_name'
	const c_name = 'blocks'
	
	const client = await mongodb.MongoClient.connect(
		uri,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)

	return client.db(db_name).collection(c_name)
}

// [EXPORT] //
module.exports = router