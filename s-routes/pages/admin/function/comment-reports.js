// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const commentReportsCollection = require('../../../../s-collections/commentReportsCollection')
const Auth = require('../../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [READ-ALL] Auth Required //
router.get(
	'/:sort/:limit/:page',
	Auth.adminToken(),
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

				// [READ-ALL] unhandled //
				const { commentReports } = await commentReportsCollection.c_readUnhandled(
					sort,
					limit,
					skip
				)

				const { count } = await commentReportsCollection.c_count()

				const totalPages = Math.ceil(count / limit)

				res.status(200).send({
					executed: true,
					status: true,
					commentReports: commentReports,
					commentReportCount: count,
					totalPages: totalPages
				})
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/pages/admin/function/commentReports: Invalid Params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/pages/admin/function/commentReports: Error --> ${err}`
			})
		}
	}
)


// [EXPORT] //
module.exports = router