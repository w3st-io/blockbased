// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const activitiesCollection = require('../../../../s-collections/activitiesCollection')
const commentLikesCollection = require('../../../../s-collections/commentLikesCollection')
const commentReportsCollection = require('../../../../s-collections/commentReportsCollection')
const commentsCollection = require('../../../../s-collections/commentsCollection')
const postsCollection = require('../../../../s-collections/postsCollection')
const postLikesCollection = require('../../../../s-collections/postLikesCollection')
const usersCollection = require('../../../../s-collections/usersCollection')
const Auth = require('../../../../s-middleware/Auth')
const timeUtil = require('../../../../s-utils/timeUtil')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/
// [READ] Params //
router.get(
	'/:user_id',
	Auth.adminTokenNotRequired(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (mongoose.isValidObjectId(req.params.user_id)) {
				const timeFrame = 60
				const timeInterval = 1
				
				let activityData = []
				let adminData = undefined

				const userObj = await usersCollection.c_readSelect({
					user_id: req.params.user_id,
					select: 'username profile_img bio created_at'
				})

				if (userObj.status) {
					if (userObj.user) {
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

						// Activity Order //
						for (let i = timeFrame; i > 0; i = i - timeInterval) {
							// timePointA & timePointB //
							const timePointA = timeUtil.pastTimeByMinutes(i + timeInterval)
							const timePointB = timeUtil.pastTimeByMinutes(i)

							// [READ-ALL] timePointA < Activity < timePointB //
							const { count: activityCount } = await activitiesCollection.c_countByUserTimeFrame(
								req.params.user_id,
								timePointA,
								timePointB
							)

							activityData.push({
								time: timePointB.toLocaleTimeString(),
								count: activityCount
							})
						}


						if (req.admin_decoded && req.admin_decoded.role == 'admin') {
							const commentReportCount = await commentReportsCollection.c_countByReportedUser(
								req.params.user_id
							)

							const commentReportHandledCount = await commentReportsCollection.c_countHandledByReportedUser(
								req.params.user_id
							)

							const commentReportUnhandledCount = await commentReportsCollection.c_countUnhandledByReportedUser(
								req.params.user_id
							)

							adminData = {
								commentReportCount: commentReportCount.count,
								commentReportHandledCount: commentReportHandledCount.count,
								commentReportUnhandledCount: commentReportUnhandledCount.count
							}
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
							adminData: adminData,
						})
					}
					else {
						res.send({
							executed: true,
							status: false,
							message: 'User not Found'
						})
					}
				}
				else { res.send(userObj) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					message: 'Invalid user_id'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/user/profile/lookup',
				message: `Caught Error --> ${err}`
			})
		}
	}
)


module.exports = router