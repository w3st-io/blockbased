/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT VOTES ROUTE %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const express = require('express')
const mongodb = require('mongodb')


// [REQUIRE] Personal //
require('dotenv').config()


// [INIT] //
const router = express.Router()


/******************* [CRUD] *******************/
// [CREATE] //
router.post('/create', async (req, res) => {
	const commentVotes = await loadCommentVotesCollection()

	await commentVotes.insertOne({
		createdAt: new Date(),
		comment_id: req.body.comment_id,
		block_id: req.body.block_id,
		user_id: req.body.user_id,
		email: req.body.email,
		username: req.body.username,
	})

	res.status(201).send()
})


// [DELETE] //
router.delete('/delete/:user_id/:comment_id', async (req, res) => {

	console.log('user', req.params.user_id, 'comment', req.params.comment_id)
	const commentVotes = await loadCommentVotesCollection()

	await commentVotes.deleteMany({
		comment_id: req.params.comment_id,
		user_id: req.params.user_id,
	})

	res.status(200).send()
})


/******************* [LOAD COLLECTION] commentVotes *******************/
async function loadCommentVotesCollection() {
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'db_name'
	const c_name = 'commentVotes'
	
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