/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%
 * %%% USER PROFILE PAGE %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const commentsCollection = require('../../../../s-collections/commentsCollection')
const commentLikesCollection = require('../../../../s-collections/commentLikesCollection')
const postsCollection = require('../../../../s-collections/postsCollection')
const postLikesCollection = require('../../../../s-collections/postLikesCollection')
const usersCollection = require('../../../../s-collections/usersCollection')
const Auth = require('../../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/

// [READ] Auth Required - Decoded //
router.get(
	'/',
	Auth.userTokenByPassVerification(),
	async (req, res) => {
		try {
			const userObj = await usersCollection.c_readSelect(
				req.decoded.user_id
			)
			
			if (userObj.status) {
				// [COUNT] Posts //
				const postCount = await postsCollection.c_countAllByUser(
					req.decoded.user_id
				)

				// [COUNT] postLikes //
				const pLCount = await postLikesCollection.c_countByPostUser(
					req.decoded.user_id
				)

				// [COUNT] Comments //
				const commentCount = await commentsCollection.c_countByUser(
					req.decoded.user_id
				)

				// [COUNT] commentLikes //
				const cLCount = await commentLikesCollection.c_countByCommentUser(
					req.decoded.user_id
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
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/pages/user/profile: Error --> ${err}`
			})
		}
	}
)


// [EXPORT] //
module.exports = router