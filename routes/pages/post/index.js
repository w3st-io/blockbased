/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% POST PAGE ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const postsCollection = require('../../../s-collections/postsCollection')
const postLikesCollection = require('../../../s-collections/postLikesCollection')
const postFollowersCollection = require('../../../s-collections/postFollowersCollection')
const commentsCollection = require('../../../s-collections/commentsCollection')
const commentLikesCollection = require('../../../s-collections/commentLikesCollection')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


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
					postObj.post.likeCount = (
						await postLikesCollection.c_countAll(postObj.post._id)
					).count
		
					// [FOLLOW-COUNT] //
					postObj.post.followersCount = (
						await postFollowersCollection.c_countAll(postObj.post._id)
					).count

					// [USER-LOGGED] //
					if (req.decoded) {
						// [LIKED-STATUS] //
						postObj.post.liked = (
							await postLikesCollection.c_existance(
								req.decoded._id,
								postObj.post._id
							)
						).existance
		
						// [FOLLOWED-STATUS] //
						postObj.post.followed = (
							await postFollowersCollection.c_existance(
								req.decoded._id,
								postObj.post._id
							)
						).existance
					}
				}
			}
			catch (err) {
				postObj = {
					executed: false,
					status: false,
					message: `/pages/post: Error --> ${err}`
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
						commentsObj.comments[i].likeCount = (
							await commentLikesCollection.c_countAll(
								commentsObj.comments[i]._id
							)
						).count

					
						// [USER-LOGGED] //
						if (req.decoded) {
							// [LIKED-STATUS] //
							commentsObj.comments[i].liked = (
								await commentLikesCollection.c_existance(
									req.decoded._id,
									commentsObj.comments[i]._id
								)
							).existance
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
				message: '/pages/post: Invalid params',
			})
		}
	},
)


// [EXPORT] //
module.exports = router