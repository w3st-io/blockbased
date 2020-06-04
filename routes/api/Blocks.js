/**
 * %%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCKS ROUTE %%% *
 * %%%%%%%%%%%%%%%%%%%% *
*/
/*** [REQUIRE] ***/
const express = require('express')
const mongodb = require('mongodb')

/*** [REQUIRE] Personal ***/
require('dotenv').config()

/*** [INIT] ***/
const router = express.Router()

/******************* [COMMENT CRUD] *******************/
/*** [CREATE] Add Post ***/
router.post('/create', async (req, res) => {
	// [INIT] // Get DB Collection //
	const blocks = await loadBlocksCollection()

	// [INSERT] Into Collection //
	await blocks.insertOne({
		block_id: req.body.block_id,
		email: req.body.email,
		comment: req.body.comment,
		createdAt: new Date()
	}).then((result) => {
		res.json({ newCommentId: result.insertedId })
	})

	// Set Status // [RES SEND] //
	res.status(201).send()
})


/******************* [COMMENT IDS CRUD] *******************/
// [CREATE]
router.post('/comment-id/create', async (req, res) => {
	const blocksXComments = await loadBlocksXCommentsCollection()
	await blocksXComments.insertOne({
		block_id: req.body.block_id,
		comment_id: req.body.comment_id,
		createdAt: new Date()
	})

	// Set Status // [RES SEND] //
	res.status(201).send()
})

// [READ ALL] Get Comment IDs for Specicifc Post ID //
router.get('/comment-id/read-all/:block_id', async (req, res) => {
	const blocksXComments = await loadBlocksXCommentsCollection()
	
	let retrievedData = await blocksXComments.find(
		{ block_id: req.params.block_id }
	).toArray()

	// [RES SEND] //
	res.send(retrievedData)
})


// [READ]
router.get('/comment-id/read/:comment_id', async (req, res) => {
	const comments = await loadCommentsCollection()

	let retrievedData = await comments.find(
		{ _id: new mongodb.ObjectID(req.params.comment_id) }
	).toArray()

	// [RES SEND] //
	res.send(retrievedData)
})


/*** [FUNCTION] Block Collection ***/
async function loadBlocksCollection() {
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'blockbased'
	const c_name = 'comments'
	
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


/*** [FUNCTION] Post-single Collection ***/
async function loadBlocksXCommentsCollection() {
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'blockbased'
	const c_name = 'blocksXComments'
	
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

/*** [FUNCTION] Comments Collection ***/
async function loadCommentsCollection() {
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'blockbased'
	const c_name = 'comments'
	
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


/*** [EXPORT] ***/
module.exports = router