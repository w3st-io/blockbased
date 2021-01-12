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
	Auth.userTokenNotRequired(),
	Auth.adminToken(),
	async (req, res) => {
		try {
			if (
				Number.isInteger(parseInt(req.params.sort)) &&
				Number.isInteger(parseInt(req.params.limit)) &&
				Number.isInteger(parseInt(req.params.page))
			) {
				// [INIT] //
				const user_id = (req.decoded) ? req.decoded.user_id : undefined
				const sort = parseInt(req.params.sort)
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit

				// [READ-ALL] Sort //
				const { posts } = await postsCollection.c_readSorted(
					user_id,
					sort,
					limit,
					skip
				)

				const { count } = await postsCollection.c_count()

				const totalPages = Math.ceil(count / limit)


				res.status(200).send({
					executed: true,
					status: true,
					posts: posts,
					postCount: count,
					totalPages: totalPages
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