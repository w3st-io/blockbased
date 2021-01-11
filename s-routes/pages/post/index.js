// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const postsCollection = require('../../../s-collections/postsCollection')
const commentsCollection = require('../../../s-collections/commentsCollection')
const commentLikesCollection = require('../../../s-collections/commentLikesCollection')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/:post_id/:limit/:page',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.params.post_id) &&
				Number.isInteger(parseInt(req.params.limit)) &&
				Number.isInteger(parseInt(req.params.page))
			) {
				// [INIT] //
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit
				let user_id = undefined

				// [SET] user_id //
				if (req.decoded) { user_id = req.decoded.user_id }

				///// [READ][POSTS] ////
				const postObj = await postsCollection.c_read(
					user_id,
					req.params.post_id
				)

				if (postObj.status) {
					//// [READ-ALL][COMMENTS] ////
					const commentsObj = await commentsCollection.c_readByPost(
						req.params.post_id,
						limit,
						skip
					)

					if (commentsObj.status) {
						for (let i = 0; i < commentsObj.comments.length; i++) {
							// [COUNT] Likes //
							commentsObj.comments[i].likeCount = (
								await commentLikesCollection.c_countByComment(
									commentsObj.comments[i]._id
								)
							).count
		
							// [USER-LOGGED] //
							if (req.decoded) {
								// [LIKED-STATE] //
								commentsObj.comments[i].liked = (
									await commentLikesCollection.c_existance(
										req.decoded.user_id,
										commentsObj.comments[i]._id
									)
								).existance
							}
						}

						// [COUNT] Comments //
						commentsObj.commentsCount = (
							await commentsCollection.c_countByPost(req.params.post_id)
						).count

						// [COUNT] Calculate Total Pages //
						commentsObj.totalPages = Math.ceil(
							commentsObj.commentsCount / limit
						)
					}
				
					res.status(200).send({
						executed: true,
						status: true,
						postObj: postObj,
						commentsObj: commentsObj,
					})
				}
				else { res.status(200).send(postObj) }
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/pages/post: Invalid params',
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/pages/post: Error --> ${err}`
			})
		}
	}
)


// [EXPORT] //
module.exports = router