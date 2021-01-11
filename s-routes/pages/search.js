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
		const postResults = await PostModel
			.fuzzySearch({ query: req.params.query })
			.populate({ path: 'user', select: 'username bio profile_img' })


		// Users //
		const userResults = await UserModel
			.fuzzySearch({ query: req.params.query })

		res.send({
			executed: true,
			status: true,
			postResults: postResults,
			userResults: userResults,
		})
	}
)


// [EXPORT] //
module.exports = router