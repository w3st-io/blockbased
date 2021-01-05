// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const commentsCollection = require('../../../../../s-collections/commentsCollection')
const commentLikesCollection = require('../../../../../s-collections/commentLikesCollection')
const postsCollection = require('../../../../../s-collections/postsCollection')
const postLikesCollection = require('../../../../../s-collections/postLikesCollection')
const usersCollection = require('../../../../../s-collections/usersCollection')
const Auth = require('../../../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [READ-ALL] Auth Required //
router.get(
	'/:user_id',
	Auth.adminToken(),
	async (req, res) => {
		try {
			if (mongoose.isValidObjectId(req.params.user_id)) {
				const userObj = await usersCollection.c_readSelect(
					req.params.user_id
				)

				if (userObj.status) {
					// [COUNT] Posts //
					const postCount = await postsCollection.c_countByUser(
						req.params.user_id
					)
	
					// [COUNT] postLikes //
					const pLCount = await postLikesCollection.c_countByPostUser(
						req.params.user_id
					)
	
					// [COUNT] Comments //
					const commentCount = await commentsCollection.c_countByUser(
						req.params.user_id
					)
	
					// [COUNT] commentLikes //
					const cLCount = await commentLikesCollection.c_countByCommentUser(
						req.params.user_id
					)
	
					res.status(200).send({
						executed: true,
						status: true,
						user: userObj.user,
						postCount: postCount.count,
						postLikeCount: pLCount.count,
						commentCount: commentCount.count,
						commentLikeCount: cLCount.count,
					})
				}
				else { res.status(200).send(userObj) }
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/pages/admin/function/users/record: Invalid Params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/pages/admin/function/users/record: Error --> ${err}`
			})
		}
	}
)


// [EXPORT] //
module.exports = router