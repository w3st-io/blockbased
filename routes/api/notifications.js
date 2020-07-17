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
const Auth = require('../../server-middleware/AuthMiddleware')
const NotificationsCollection = require('../../server-collections/NotificationsCollections')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [READ-ALL] //
router.get(
	'/read-all/:amount/:skip',
	Auth.userToken(),
	async (req, res) => {
		const returnedData = await NotificationsCollection.readAll(req)

		res.status(200).send(returnedData)
	}
)


// [EXPORT] //
module.exports = router