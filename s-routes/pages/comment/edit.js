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
				const returned = await commentsCollection.c_read(
					req.decoded.user_id,
					req.params.comment_id
				)
	
				res.status(200).send(returned)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/comments/edit: Invalid comment _id'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/comments/edit: Error --> ${err}`,
			})
		}
	}
)


// [EXPORT] //
module.exports = router