/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT VOTE MIDDLEWARE %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 */
// [REQUIRE] //
const jwt = require('jsonwebtoken')
const mongodb = require('mongodb')
require('dotenv').config()


// [REQUIRE] Personal //
const Collections = require('../server-collections')


class CommentVoteMiddleware {
	static verifyOwnership() {
		return async (req, res, next) => {
			const commentVotes = await Collections.loadCommentVotesCollection()
			let returnedData = await commentVotes.findOne({
				comment_id: req.params.comment_id,
				user_id: req.decoded._id,
			})

			if (returnedData) { next() }
			else {
				return res.status(401).send({
					auth: false,
					error: 'Sorry man, you dont own this block-vote!'
				})
			}
		}
	}

	static verifyNonExistance() {
		return async (req, res, next) => {
			const commentVotes = await Collections.loadCommentVotesCollection()
			let returnedData = await commentVotes.findOne({
				comment_id: req.body.comment_id,
				user_id: req.decoded._id,
			})

			if (returnedData) {
				return res.status(401).send({
					auth: true,
					error: 'Sorry man, comment-vote already exists!'
				})
			}
			else { next() }
		}
	}
}


// [EXPORT] //
module.exports = CommentVoteMiddleware
