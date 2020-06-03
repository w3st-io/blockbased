/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% POSTS ROUTE %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/
/*** [REQUIRE] ***
const express = require('express')
const mongodb = require('mongodb')

/*** [REQUIRE] Personal ***
require('dotenv').config()

/*** [INIT] ***
const router = express.Router()

/*** [READ] Get Comment IDs for Specicifc Post ID ***
router.get('/get-all/:post_id', async (req, res) => {
	// [INIT] // Get DB Collection // Retrieve From Collection //
	const postXSingle = await loadPostXCommentCollection()
	let retrievedData = await postXSingle.find(
		{ post_id: req.params.post_id }
	).toArray()

	// [RES SEND] //
	res.send(retrievedData)
})*/


/*** [CREATE] Add Post ***
router.post('/', async (req, res) => {
	// [INIT] // Get DB Collection //
	const posts = await loadPostsCollection()

	// [INSERT] Into Collection //
	await posts.insertOne({
		text: req.body.text,
		email: req.body.email,
		createdAt: new Date()
	}).then((insertedData) => {
			console.log('Data Id:', insertedData.insertedId)
		})

	// Set Status // [RES SEND] //
	res.status(201).send()
})*/


/*** [DELETE] Delete Post ***
router.delete('/delete/:id', async (req, res) => {
	const posts = await loadPostsCollection()
	
	// [DELETE] //
	await posts.deleteOne(
		{ _id: new mongodb.ObjectID(req.params.id) }
	)

	// Set Status // [RES SEND] //
	res.status(200).send()
})*/
///////////////// CRRUD DONE /////////////////

// [FUNCTION] Post Collection in Database //
async function loadPostsCollection() {
	// [INIT] //
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'db_name'
	const c_name = 'posts'
	
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