/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENTS ROUTE %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
/*** [REQUIRE] ***/
const express = require('express')
const mongodb = require('mongodb')

/*** [REQUIRE] Personal ***/
require('dotenv').config()

/*** [INIT] ***/
const router = express.Router()

/******************* [COMMENT CRUD] *******************/
/*** [CREATE] Comment ***/
router.post('/create', async (req, res) => {
	const comments = await loadCommentsCollection()
	await comments.insertOne({
		block_id: req.body.block_id,
		email: req.body.email,
		comment: req.body.comment,
		createdAt: new Date()
	}).then((result) => {
		res.json({ newCommentId: result.insertedId })
	})

	res.status(201).send()
})


// [READ] Comments //
router.get('/read-all/:block_id/:amountPerPage/:skip', async (req, res) => {
	let skip = parseInt(req.params.skip)
	let amountPerPage = parseInt(req.params.amountPerPage)

	const comments = await loadCommentsCollection()
	let retrievedData = await comments.find(
		{ block_id: req.params.block_id }
	).skip(skip)
	.limit(amountPerPage)
	.toArray()

	res.send(retrievedData)
})


/*** [LOAD COLLECTION] COMMENTS ***/
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


/*** [EXPORT] ***/
module.exports = router