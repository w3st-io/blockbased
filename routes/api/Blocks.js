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
/*** [CREATE] Add Comment ***/
router.post('/create-comment', async (req, res) => {
	// [INIT] // Get DB Collection //
	const comments = await loadCommentsCollection()

	// [INSERT] Into Collection //
	await comments.insertOne({
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


// [READ] Get Comments //
router.get('/read-comments/:block_id/:skip', async (req, res) => {
	let skip = parseInt(req.params.skip)

	const comments = await loadCommentsCollection()
	let retrievedData = await comments.find(
		{ block_id: req.params.block_id }
	).skip(skip)
	.limit(5)
	.toArray()

	// [RES SEND] //
	res.send(retrievedData)
})


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