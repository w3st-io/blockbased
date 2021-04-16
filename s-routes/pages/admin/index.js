// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const usersCollection = require('../../../s-collections/usersCollection')
const activitiesCollection = require('../../../s-collections/activitiesCollection')
const Auth = require('../../../s-middleware/Auth')
const socketUtil = require('../../../s-utils/socketUtil')
const timeUtil = require('../../../s-utils/timeUtil')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [READ-ALL] Auth Required //
router.get(
	'/',
	Auth.adminToken(),
	async (req, res) => {
		try {
			// [INIT] Const //
			const userSockets = socketUtil.getAllUserSockets()
			const timeFrame = 60
			const timeInterval = 1

			// [INIT] //
			let users = []
			let activityData = []

			// Users Online //
			for (let i = 0; i < userSockets.length; i++) {
				const user = await usersCollection.c_readSelect({
					user_id: userSockets[i].user_id,
					select: 'username email'
				})

				users.push(user.user)
			}

			// Activity Order //
			for (let i = timeFrame; i > 0; i = i - timeInterval) {
				// timePointA & timePointB //
				const timePointA = timeUtil.pastTimeByMinutes(i + timeInterval)
				const timePointB = timeUtil.pastTimeByMinutes(i)

				// [READ-ALL] timePointA < Activity < timePointB //
				const { count: activityCount } = await activitiesCollection.c_countTimeFrame(
					timePointA,
					timePointB
				)

				activityData.push({
					time: timePointB.toLocaleTimeString(),
					count: activityCount
				})
			}

			res.status(200).send({
				executed: true,
				status: true,
				users,
				activityData,
			})
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/pages/admin: Error --> ${err}`
			})
		}
	}
)


module.exports = router