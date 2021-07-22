// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const commentsCollection = require('../../../../s-collections/commentsCollection')
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

				// [READ-ALL] Sort //
				const { comments } = await commentsCollection.c_readSorted({
					user_id: undefined,
					sort: sort,
					limit: limit,
					skip: skip
				})

				const { count } = await commentsCollection.c_count()

				const totalPages = Math.ceil(count / limit)

				res.send({
					executed: true,
					status: true,
					comments: comments,
					commentCount: count,
					totalPages: totalPages,
				})
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/pages/admin/function/comments',
					message: 'Invalid Params',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/admin/function/comments',
				message: `Caught Error --> ${err}`,
			})
		}
	}
)


module.exports = router