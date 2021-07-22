// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const commentsCollection = require('../../../s-collections/commentsCollection')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [READ] //
router.get(
	'/:comment_id',
	Auth.userToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (validator.isAscii(req.params.comment_id)) {
				// [READ] Comment //
				const returned = await commentsCollection.c_read({
					user_id: req.user_decoded.user_id,
					comment_id: req.params.comment_id
				})
	
				res.send(returned)
			}
			else {
				res.send({
					executed: true,
					status: false,
					message: '/api/comments/reply: Invalid comment _id'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				message: `/api/comments/reply: Error --> ${err}`,
			})
		}
	},
)


module.exports = router