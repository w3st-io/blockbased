/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% NOTIFICATIONS ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
require('dotenv').config()


// [REQUIRE] Personal //
const notificationsCollection = require('../../server-collections/notificationsCollection')
const Auth = require('../../server-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ-ALL] //
router.get(
	'/read-all',
	Auth.userToken(),
	async (req, res) => {
		const returnedData = await notificationsCollection.c_readAll(req.decoded._id)

		res.status(200).send(returnedData)
	}
)


/******************* [MARK-READ-STATUS] *******************/
router.get(
	'/mark-read/:notification_id',
	Auth.userToken(),
	async (req, res) => {
		const returnedData = await notificationsCollection.c_markRead(
			req.decoded._id,
			req.params.notification_id
		)

		res.status(200).send(returnedData)
	}
)


// [EXPORT] //
module.exports = router