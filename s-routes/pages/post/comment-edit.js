/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
 * %%% POST COMMENT-EDIT ROUTES %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const commentsCollection = require('../../../s-collections/commentsCollection')
const commentLikesCollection = require('../../../s-collections/commentLikesCollection')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [READ] //
router.get(
	'/:comment_id',
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (mongoose.isValidObjectId(req.params.comment_id)) {
				// [READ] Comment //
				const returned = await commentsCollection.c_read(req.params.comment_id)
			
				if (returned.status) {
					// [COUNT] Likes //
					returned.comment.likeCount = (
						await commentLikesCollection.c_countAllByComment(req.params.comment_id)
					).count
	
					// [USER-LOGGED] //
					if (req.decoded) {
						// [LIKED-STATUS] //
						returned.comment.liked = (
							await commentLikesCollection.c_existance(
								req.decoded.user_id,
								req.params.comment_id
							)
						).existance
					}
				}
	
				res.status(200).send(returned)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/comments: Invalid comment _id'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/comments: Error --> ${err}`,
			})
		}
	},
)


// [EXPORT] //
module.exports = router