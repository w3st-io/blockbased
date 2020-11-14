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


router.get(
	'/:sort/:limit/:page',
	async (req, res) => {
		try {
			// [VALIDATE] //
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

				console.log('ss', sort, limit, req.params.page, skip)

				const activities = await activitiesCollection.c_readAllSort(
					sort,
					limit,
					skip
				)
				
				res.status(200).send(activities)
			}
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