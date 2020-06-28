/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT VOTE ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongodb = require('mongodb')
require('dotenv').config()


// [REQUIRE] Personal //
const Auth = require('../../server-middleware/AuthMiddleware')
const CommentVoteAuth = require('../../server-middleware/CommentVoteAuthMiddleware')
const Collections = require('../../server-collections')


// [INIT] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userCheck(),
	CommentVoteAuth.verifyNonExistance(),
	async (req, res) => {
		const commentVotes = await Collections.loadCommentVotesCollection()
		await commentVotes.insertOne({
			createdAt: new Date(),
			comment_id: req.body.comment_id,
			block_id: req.body.block_id,
			user_id: req.body.user_id,
			email: req.body.email,
			username: req.body.username,
		})

		res.status(201).send()
	}
)


// [DELETE] Auth Required - User's Single Comment Vote //
router.delete(
	'/delete/:user_id/:comment_id',
	Auth.userCheck(),
	async (req, res) => {
		const commentVotes = await Collections.loadCommentVotesCollection()
		await commentVotes.deleteMany({
			comment_id: req.params.comment_id,
			user_id: req.params.user_id,
		})

		res.status(200).send()
	}
)

// [DELETE ALL] Auth Required - Comment's All User Vote //
router.delete(
	'/delete-all/:comment_id',
	Auth.userCheck(),
	// Comment ownership validation here (note: not comment vote)
	async (req, res) => {
	const commentVotes = await Collections.loadCommentVotesCollection()
	await commentVotes.deleteMany({
		comment_id: req.params.comment_id,
	})

	res.status(200).send()
})


// [EXPORT] //
module.exports = router