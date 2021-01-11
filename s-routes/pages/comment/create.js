// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const postsCollection = require('../../../s-collections/postsCollection')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/:post_id',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (validator.isAscii(req.params.post_id)) {
				let user_id = undefined

				// [SET] user_id //
				if (req.decoded) { user_id = req.decoded.user_id }

				// [READ] Post //
				const postObj = await postsCollection.c_read(
					user_id,
					req.params.post_id
				)

				res.status(200).send(postObj)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: 'Invalid post_id',
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/posts: Error --> ${err}`
			})
		}
	}
)


// [EXPORT] //
module.exports = router