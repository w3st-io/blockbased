/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% POST PAGE ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const validator = require('validator')
require('dotenv').config()


// [REQUIRE] Personal //
const postsCollection = require('../../../server-collections/postsCollection')
const postLikesCollection = require('../../../server-collections/postLikesCollection')
const postFollowersCollection = require('../../../server-collections/postFollowersCollection')
const commentsCollection = require('../../../server-collections/commentsCollection')
const commentLikesCollection = require('../../../server-collections/commentLikesCollection')
const Auth = require('../../../server-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [COMMENT] *******************/
// [READ-ALL] //
router.get(
	'/:post_id/:limit/:skip',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		// [VALIDATE] //
		if (
			mongoose.isValidObjectId(req.params.post_id) &&
			Number.isInteger(parseInt(req.params.limit)) &&
			Number.isInteger(parseInt(req.params.skip))
		) {
			let postObj
			let commentsObj

			/******* [POSTS] *******/
			try {
				postObj = await postsCollection.c_read(req.params.post_id)
			
				if (postObj.status) {
					// [LIKE-COUNT] //
					postObj.post.likeCount = { count } = await postLikesCollection.c_countAll(
						postObj.post._id
					)
		
					// [FOLLOW-COUNT] //
					postObj.post.followersCount = { count } = await postFollowersCollection.c_countAll(
						postObj.post._id
					)

					// [USER-LOGGED] //
					if (req.decoded) {
						// [LIKED-STATUS] //
						postObj.post.liked = { existance } = await postLikesCollection.c_existance(
							req.decoded._id,
							postObj.post._id
						)
		
						// [FOLLOWED-STATUS] //
						postObj.post.followed = { existance } = await postFollowersCollection.c_existance(
							req.decoded._id,
							postObj.post._id
						)
					}
				}
			}
			catch (err) {
				postObj = {
					executed: false,
					status: false,
					message: `${err}`
				}
			}

			/******* [COMMENTS] *******/
			try {
				commentsObj = await commentsCollection.c_readAll(
					req.params.post_id,
					parseInt(req.params.skip),
					parseInt(req.params.limit)
				)
	
				// Set details of comments.. //
				if (commentsObj.status) {
					for (let i = 0; i < commentsObj.comments.length; i++) {
						// [LIKE-COUNT] //
						const { count: commentLikeCount } = await commentLikesCollection.c_countAll(
							commentsObj.comments[i]._id
						)
						commentsObj.comments[i].likeCount = commentLikeCount
					
						// [USER-LOGGED] //
						if (req.decoded) {
							// [LIKED-STATUS] //
							const { existance: commentLikedStatus } = await commentLikesCollection.c_existance(
								req.decoded._id,
								commentsObj.comments[i]._id
							)
							commentsObj.comments[i].liked = commentLikedStatus
						}
					}
				}
			}
			catch (err) {
				commentsObj = {
					executed: false,
					status: false,
					message: `${err}`
				}
			}

			res.status(200).send({
				postObj: postObj,
				commentsObj: commentsObj
			})
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'comments: Invalid params',
			})
		}
	},
)


// [EXPORT] //
module.exports = router