// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const postsCollection = require('../../s-collections/postsCollection')
const PostModel = require('../../s-models/PostModel')
const UserModel = require('../../s-models/UserModel')
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
		const { posts } = await postsCollection.c_fuzzySearch(
			user_id,
			req.params.query
		)

		// Users //
		const users = await UserModel
			.fuzzySearch({ query: req.params.query })

		res.send({
			executed: true,
			status: true,
			postResults: posts,
			userResults: users,
		})
	}
)


// [EXPORT] //
module.exports = router