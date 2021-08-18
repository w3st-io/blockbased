// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const notificationsCollection = require('../../../s-collections/notificationsCollection')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [OTHER-CRUD] *******************/
// [READ-ALL] unread //
router.get(
	'/read-unread/:sort/:limit/:page',
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

				const { notifications } = await notificationsCollection.c_readByUserSortedUnread(
					req.user_decoded.user_id,
					sort,
					limit,
					skip,
				)

				const { count } = await notificationsCollection.c_countUnread(
					req.user_decoded.user_id,
				)

				res.send({
					executed: true,
					status: true,
					notifications: notifications,
					unreadNotificationCount: count,
				})
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/notifications/read-unread',
					message: 'Invalid Params',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/notifications/read-unread',
				message: `Caught Error --> ${err}`,
			})
		}
	}
)


/******************* [MARK-READ-STATUS] *******************/
// [UPDATE] set read to true //
router.get(
	'/mark-read/:notification_id',
	Auth.userToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (validator.isAscii(req.params.notification_id)) {
				const returned = await notificationsCollection.c_markRead(
					req.params.notification_id
				)

				res.send(returned)
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/notifications/mark-unread',
					message: 'Invalid notification_id'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/notifications/mark-unread',
				message: `Caught Error --> ${err}`,
			})
		}
	}
)


module.exports = router