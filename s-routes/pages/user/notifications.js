// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const notificationsCollection = require('../../../s-collections/notificationsCollection')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [READ-ALL] //
router.get(
	'/:sort/:limit/:page',
	Auth.userToken(),
	async (req, res) => {
		try {
			if (
				Number.isInteger(parseInt(req.params.sort)) &&
				Number.isInteger(parseInt(req.params.limit)) &&
				Number.isInteger(parseInt(req.params.page))
			) {
				// [INIT] //
				const sort = parseInt(req.params.sort)
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit

				// [READ-ALL] //
				const { notifications } = await notificationsCollection.c_readByUserSorted(
					req.decoded.user_id,
					sort,
					limit,
					skip
				)

				// [COUNT] postFollows //
				const {
					count: totalNotifications
				} = await notificationsCollection.c_count(req.decoded.user_id)
				

				// [COUNT] totalPages //
				const totalPages = Math.ceil(totalNotifications / limit)
				

				res.status(200).send({
					executed: true,
					status: true,
					notifications: notifications,
					totalNotifications: totalNotifications,
					totalPages,
				})
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/pages/notifications: Invalid Params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/pages/notifications: Error --> ${err}`
			})
		}
	},
)
	
	
module.exports = router