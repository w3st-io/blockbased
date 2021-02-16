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

				const activitiesObj = await activitiesCollection.c_readSorted({
					sort: sort,
					limit: limit,
					skip: skip
				})
				
				// [COUNT] Activities //
				activitiesObj.count = (
					await activitiesCollection.c_count()
				).count
				
				// [COUNT] Calculate Pages //
				activitiesObj.totalPages = Math.ceil(activitiesObj.count / limit)

				res.status(200).send(activitiesObj)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/pages/activity: Invalid params'
				})
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