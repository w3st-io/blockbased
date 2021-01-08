// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const bansCollection = require('../../../s-collections/bansCollection')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [BAN] *******************/
// [UPDATE] Auth Required //
router.get(
	'/ban/:user_id/:hours',
	Auth.adminToken(),
	async (req, res) => {
		try {
			// [SANITZE] //
			hours = parseInt(req.params.hours)

			// [VALIDATE] //
			if (
				mongoose.isValidObjectId(req.params.user_id) &&
				Number.isInteger(parseInt(req.params.hours))
			) {
				const returned = await bansCollection.c_create(
					req.params.user_id,
					hours
				)

				res.status(200).send(returned)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/admin/users: Invalid user_id'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/admin/users: Error --> ${err}`,
			})
		}
	}
)


// [EXPORT] //
module.exports = router