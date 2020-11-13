/**
 * %%%%%%%%%%%%%%%%%%%%%%
 * %%% ACTIVITIY PAGE %%%
 * %%%%%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const activitiesCollection = require('../../../s-collections/activitiesCollection')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/

// [READ] Auth Required - Decoded //
router.get(
	'/',
	async (req, res) => {
		try {
			const activities = await activitiesCollection.c_readAll()
			
			res.status(200).send(activities)
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/pages/activity: Error --> ${err}`
			})
		}
	}
)


// [EXPORT] //
module.exports = router