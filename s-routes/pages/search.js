// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const PostModel = require('../../s-models/PostModel')
const UserModel = require('../../s-models/UserModel')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [SEARCH] //
router.get(
	'/:query',
	async (req, res) => {
		// Posts //
		const postResult = await PostModel.fuzzySearch({ query: req.params.query })

		// Users //
		const userResult = await UserModel.fuzzySearch({ query: req.params.query })

		res.send({
			executed: true,
			status: true,
			postResult: postResult,
			userResult: userResult,
		})
	}
)


// [EXPORT] //
module.exports = router