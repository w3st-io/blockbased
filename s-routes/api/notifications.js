// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const notificationsCollection = require('../../s-collections/notificationsCollection')
const Auth = require('../../s-middleware/Auth')


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
					req.decoded.user_id,
					sort,
					limit,
					skip,
				)

				const { count } = await notificationsCollection.c_countUnread(
					req.decoded.user_id,
				)

				res.status(200).send({
					executed: true,
					status: true,
					notifications: notifications,
					unreadNotificationCount: count,
				})
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/notifications/read-unread: Invalid Params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/notifications/read-unread: Error --> ${err}`,
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

				res.status(200).send(returned)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/notifications/mark-unread: Invalid notification_id'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/notifications/mark-unread: Error --> ${err}`,
			})
		}
	}
)


// [EXPORT] //
module.exports = router