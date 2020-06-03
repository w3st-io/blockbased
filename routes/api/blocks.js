/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% POSTS ROUTE %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/
/*** [REQUIRE] ***/
const express = require('express')
const mongodb = require('mongodb')

/*** [REQUIRE] Personal ***/
require('dotenv').config()

/*** [INIT] ***/
const router = express.Router()

/*** [READ] Get Posts ***
router.get('/:cat_id', async (req, res) => {
	// [INIT] // Get DB Collection // Retrieve From Collection //
	const blocks = await loadBlocksCollection()
	let retrievedData = await blocks.find(
		{ cat_id: req.params.cat_id }
	).toArray()

	// [RES SEND] //
	res.send(retrievedData)
})


/*** [CREATE] Add Post ***/
router.post('/create', async (req, res) => {
	// [INIT] // Get DB Collection //
	const blocks = await loadBlocksCollection()

	// [INSERT] Into Collection //
	await blocks.insertOne({
		cat_id: req.body.cat_id,
		title: req.body.title,
		createdAt: new Date()
	})

	// Set Status // [RES SEND] //
	res.status(201).send()
})

/*** [READ ALL] Get Events ***/
router.get('/read-all', async (req, res) => {
	// [INIT] // Get DB Collection // Retrieve From Collection //
	const blocks = await loadBlocksCollection()
	let retrievedData = await blocks.find({}).toArray()

	// [RES SEND] //
	res.send(retrievedData)
})


/*** [DELETE] Delete Post ***
router.delete('/delete/:id', async (req, res) => {
	const posts = await loadBlocksCollection()
	
	// [DELETE] //
	await posts.deleteOne(
		{ _id: new mongodb.ObjectID(req.params.id) }
	)

	// Set Status // [RES SEND] //
	res.status(200).send()
})
///////////////// CRRUD DONE /////////////////

/*** [FUNCTION] Post Collection in Database ***/
async function loadBlocksCollection() {
	// [INIT] //
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

	// [RETURN] //
	return client.db(db_name).collection(c_name)
}

module.exports = router