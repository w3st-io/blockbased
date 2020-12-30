/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%
 * %%% NOTIFICATIONS ROUTES %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const notificationsCollection = require('../../s-collections/notificationsCollection')
const Auth = require('../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [OTHER-CRUD] *******************/
// [READ-ALL] unread //
router.get(
	'/read-unread',
	Auth.userToken(),
	async (req, res) => {
		try {
			const returned = await notificationsCollection.c_readByUserSortedUnread(
				req.decoded.user_id
			)

			res.status(200).send(returned)
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/notifications: Error --> ${err}`,
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
			if (mongoose.isValidObjectId(req.params.notification_id)) {
				const returned = await notificationsCollection.c_markRead(
					req.params.notification_id
				)

				res.status(200).send(returned)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: 'Invalid notification_id'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/notifications: Error --> ${err}`,
			})
		}
	}
)


// [EXPORT] //
module.exports = router