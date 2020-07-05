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
const CommentM = require('../../server-middleware/CommentMiddleware')
const CommentVoteM = require('../../server-middleware/CommentVoteMiddleware')
const Collections = require('../../server-collections')


// [INIT] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userTokenCheck(),
	CommentVoteM.verifyNonExistance(),
	async (req, res) => {
		const commentVotes = await Collections.loadCommentVotesCollection()
		await commentVotes.insertOne({
			createdAt: new Date(),
			block_id: req.body.block_id,
			comment_id: req.body.comment_id,
			user_id: req.decoded._id,
			email: req.decoded.email,
			username: req.decoded.username,
		})

		res.status(201).send({
			auth: true,
			error: 'Created commentVote'
		})
	}
)


// [DELETE] Auth Required - User's Single Comment Vote //
router.delete(
	'/delete/:comment_id',
	Auth.userTokenCheck(),
	async (req, res) => {
		const commentVotes = await Collections.loadCommentVotesCollection()
		await commentVotes.deleteMany({
			comment_id: req.params.comment_id,
			user_id: req.decoded._id,
		})

		res.status(200).send({
			auth: true,
			message: 'Deleted commentVote'
		})
	}
)

// [DELETE ALL] Auth Required - Comment's All User Vote //
router.delete(
	'/delete-all/:comment_id',
	Auth.userTokenCheck(),
	CommentM.verifyOwnershipCommentId(),
	async (req, res) => {
		const comment_id = req.params.comment_id

		const commentVotes = await Collections.loadCommentVotesCollection()
		await commentVotes.deleteMany({ comment_id: comment_id })

		res.status(200).send({
			auth: true,
			message: 'Deleted ALL commentVotes for a specific comment'
		})
	}
)


// [EXPORT] //
module.exports = router