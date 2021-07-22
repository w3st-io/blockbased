// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const postsCollection = require('../../../s-collections/postsCollection')
const commentsCollection = require('../../../s-collections/commentsCollection')
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
				const user_id = (req.user_decoded) ? req.user_decoded.user_id : undefined
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit

				///// [READ][POSTS] ////
				const postObj = await postsCollection.c_read(
					user_id,
					req.params.post_id
				)

				if (postObj.status) {
					//// [READ-ALL][COMMENTS] ////
					const commentsObj = await commentsCollection.c_readByPost({
						user_id: user_id,
						post_id: req.params.post_id,
						limit: limit,
						skip: skip
					})

					if (commentsObj.status) {
						// [COUNT] Comments //
						commentsObj.commentsCount = (
							await commentsCollection.c_countByPost(req.params.post_id)
						).count

						// [COUNT] Calculate Total Pages //
						commentsObj.totalPages = Math.ceil(
							commentsObj.commentsCount / limit
						)
					}
				
					res.send({
						executed: true,
						status: true,
						postObj: postObj,
						commentsObj: commentsObj,
					})
				}
				else { res.send(postObj) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/pages/post',
					message: 'Invalid params',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/post',
				message: `Caught Error --> ${err}`
			})
		}
	}
)


module.exports = router