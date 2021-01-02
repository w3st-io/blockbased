// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const postsCollection = require('../../../../s-collections/postsCollection')
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
				const { posts } = await postsCollection.c_readSorted(
					sort,
					limit,
					skip
				)

				res.status(200).send({
					executed: true,
					status: true,
					posts: posts,
				})
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/pages/admin/function/posts: Invalid Params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/pages/admin/function/posts: Error --> ${err}`
			})
		}
	}
)


// [EXPORT] //
module.exports = router