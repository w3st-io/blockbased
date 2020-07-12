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


// [READ-ALL] //
router.get(
	'/read-all/:amount/:skip',
	Auth.userTokenCheck(),
	async (req, res) => {
		const returnedData = await NotificationsCollection.readAll(req)

		res.status(200).send(returnedData)
	}
)


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [EXPORT] //
module.exports = router