/**
 * %%%%%%%%%%%%%%%%%% *
 * %%% CATS ROUTE %%% *
 * %%%%%%%%%%%%%%%%%% *
*/
/*** [REQUIRE] ***/
const express = require('express')
const mongodb = require('mongodb')

/*** [REQUIRE] Personal ***/
require('dotenv').config()

/*** [INIT] ***/
const router = express.Router()


// [CREATE] //
router.post('/create', async (req, res) => {
	const blocks = await loadBlocksCollection()
	await blocks.insertOne({
		email: req.body.email,
		cat_id: req.body.cat_id,
		title: req.body.title,
		createdAt: new Date()
	})

	res.status(201).send()
})


// [READ ALL] //
router.get('/read-all/:cat_id', async (req, res) => {
	const blocks = await loadBlocksCollection()
	let retrievedData = await blocks.find(
		{ cat_id: req.params.cat_id }
	)
	.project()
	.toArray()

	res.send(retrievedData)
})


// [READ ALL] //
router.get(`/read/:block_id`, async (req, res) => {
	const blocks = await loadBlocksCollection()
	let retrievedData = await blocks.findOne(
		{ _id: new mongodb.ObjectID(req.params.block_id) }
	)

	res.send(retrievedData)
})


/*** [LOAD COLLECTION] BLOCKS ***/
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

/*** [EXPORT] ***/
module.exports = router