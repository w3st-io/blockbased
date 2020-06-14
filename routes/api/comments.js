/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENTS ROUTE %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const express = require('express')
const mongodb = require('mongodb')

// [REQUIRE] Personal //
require('dotenv').config()

// [INIT] //
const router = express.Router()

/******************* [COMMENT CRUD] *******************/
// [CREATE] //
router.post('/create', async (req, res) => {
	const comments = await loadCommentsCollection()
	await comments.insertOne({
		createdAt: new Date(),
		block_id: req.body.block_id,
		user_id: req.body.user_id,
		email: req.body.email,
		username: req.body.username,
		comment: req.body.comment,
		voteCount: 0,
		
	}).then((result) => {
		res.json({ newCommentId: result.insertedId })
	})

	res.status(201).send()
})


// [READ] //
router.get('/read-all/:block_id/:amountPerPage/:skip', async (req, res) => {
	let skip = parseInt(req.params.skip)
	let amountPerPage = parseInt(req.params.amountPerPage)

	const comments = await loadCommentsCollection()
	let retrievedData = await comments.find(
		{ block_id: req.params.block_id }
	)
	.skip(skip)
	.limit(amountPerPage)
	.toArray()

	res.send(retrievedData)
})


/*** [LOAD COLLECTION] comments ***/
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

	return client.db(db_name).collection(c_name)
}


// [EXPORT] //
module.exports = router