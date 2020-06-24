/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT VOTE ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongodb = require('mongodb')


// [REQUIRE] Personal //
const Auth = require('../../auth/AuthMiddleware')
require('dotenv').config()


// [INIT] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post('/create', Auth.userCheck(), async (req, res) => {
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


// [DELETE] Auth Required - User's Single Comment Vote //
router.delete('/delete/:user_id/:comment_id', Auth.userCheck(), async (req, res) => {
	const commentVotes = await loadCommentVotesCollection()
	await commentVotes.deleteMany({
		comment_id: req.params.comment_id,
		user_id: req.params.user_id,
	})

	res.status(200).send()
})

// [DELETE ALL] Auth Required - Comment's All User Vote //
router.delete('/delete-all/:comment_id', Auth.userCheck(), async (req, res) => {
	const commentVotes = await loadCommentVotesCollection()
	await commentVotes.deleteMany({
		comment_id: req.params.comment_id,
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