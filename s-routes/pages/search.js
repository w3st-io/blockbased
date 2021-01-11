// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const postsCollection = require('../../s-collections/postsCollection')
const usersCollection = require('../../s-collections/usersCollection')
const Auth = require('../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [SEARCH] //
router.get(
	'/:query',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		// [INIT] //
		const user_id = (req.decoded) ? req.decoded.user_id : undefined
		
		// Posts //
		const { posts, count: postCount } = await postsCollection.c_fuzzySearch(
			user_id,
			req.params.query
		)

		// Users //
		const { users, count: userCount } = await usersCollection.c_fuzzySearch(
			user_id,
			req.params.query
		)

		res.send({
			executed: true,
			status: true,
			postResults: posts,
			postCount: postCount,
			userResults: users,
			userCount: userCount,
		})
	}
)


// [EXPORT] //
module.exports = router