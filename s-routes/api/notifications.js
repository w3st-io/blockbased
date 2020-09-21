/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% NOTIFICATIONS ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()


// [REQUIRE] Personal //
const notificationsCollection = require('../../s-collections/notificationsCollection')
const Auth = require('../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ-ALL] //
router.get(
	'/read-all',
	Auth.userToken(),
	async (req, res) => {
		try {
			const returned = await notificationsCollection.c_readAll(req.decoded._id)

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
router.get(
	'/mark-read/:notification_id',
	Auth.userToken(),
	async (req, res) => {
		// [VALIDATE] //
		if (mongoose.isValidObjectId(req.params.notification_id)) {
			try {
				const returned = await notificationsCollection.c_markRead(
					req.params.notification_id
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
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'Invalid notification_id'
			})
		}
	}
)


// [EXPORT] //
module.exports = router