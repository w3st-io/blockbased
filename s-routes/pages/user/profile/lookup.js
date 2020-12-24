/**
 * %%%%%%%%%%%%%%%%%%%
 * %%% USER ROUTES %%%
 * %%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const commentsCollection = require('../../../../s-collections/commentsCollection')
const commentLikesCollection = require('../../../../s-collections/commentLikesCollection')
const postsCollection = require('../../../../s-collections/postsCollection')
const postLikesCollection = require('../../../../s-collections/postLikesCollection')
const usersCollection = require('../../../../s-collections/usersCollection')

// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/
// [READ] Params //
router.get(
	'/:user_id',
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (mongoose.isValidObjectId(req.params.user_id)) {
				const userObj = await usersCollection.c_readSensitive(
					req.params.user_id,
					'username profileImg bio created_at'
				)

				if (userObj.status) {
					// [COUNT] Posts //
					const postCount = await postsCollection.c_countAllByUser(
						req.params.user_id
					)

					// [COUNT] postLikes //
					const pLCount = await postLikesCollection.c_countAllByPostUser(
						req.params.user_id
					)

					// [COUNT] Comments //
					const commentCount = await commentsCollection.c_countAllByUser(
						req.params.user_id
					)

					// [COUNT] commentLikes //
					const cLCount = await commentLikesCollection.c_countAllByCommentUser(
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
					message: 'Invalid user_id'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/pages/user/profile/lookup: Error --> ${err}`
			})
		}
	}
)


// [EXPORT] //
module.exports = router