// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const activitiesCollection = require('../../../../s-collections/activitiesCollection')
const commentsCollection = require('../../../../s-collections/commentsCollection')
const commentLikesCollection = require('../../../../s-collections/commentLikesCollection')
const postsCollection = require('../../../../s-collections/postsCollection')
const postLikesCollection = require('../../../../s-collections/postLikesCollection')
const usersCollection = require('../../../../s-collections/usersCollection')
const Auth = require('../../../../s-middleware/Auth')
const timeUtil = require('../../../../s-utils/timeUtil')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/
// [READ] Auth Required - user_decoded //
router.get(
	'/',
	Auth.userTokenByPassVerification(),
	async (req, res) => {
		try {
			const timeFrame = 60
			const timeInterval = 1

			let activityData = []

			const userObj = await usersCollection.c_readSelect({
				user_id: req.user_decoded.user_id
			})
			
			if (userObj.status) {
				// [COUNT] Posts //
				const postCount = await postsCollection.c_countByUser(
					req.user_decoded.user_id
				)

				// [COUNT] postLikes //
				const pLCount = await postLikesCollection.c_countByPostUser(
					req.user_decoded.user_id
				)

				// [COUNT] Comments //
				const commentCount = await commentsCollection.c_countByUser(
					req.user_decoded.user_id
				)

				// [COUNT] commentLikes //
				const cLCount = await commentLikesCollection.c_countByCommentUser(
					req.user_decoded.user_id
				)

				// Activity Order //
				for (let i = timeFrame; i > 0; i = i - timeInterval) {
					// timePointA & timePointB //
					const timePointA = timeUtil.pastTimeByMinutes(i + timeInterval)
					const timePointB = timeUtil.pastTimeByMinutes(i)

					// [READ-ALL] timePointA < Activity < timePointB //
					const { count: activityCount } = await activitiesCollection.c_countByUserTimeFrame(
						req.user_decoded.user_id,
						timePointA,
						timePointB
					)

					activityData.push({
						time: timePointB.toLocaleTimeString(),
						count: activityCount
					})
				}

				res.send({
					executed: true,
					status: true,
					user: userObj.user,
					postCount: postCount.count,
					postLikeCount: pLCount.count,
					commentCount: commentCount.count,
					commentLikeCount: cLCount.count,
					activityData: activityData,
				})
			}
			else { res.send(userObj) }
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/user/profile',
				message: `Caught Error --> ${err}`
			})
		}
	}
)


module.exports = router