// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const cats = require('../../../s-defaults/cats')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		try {
			res.status(200).send({
				executed: true,
				status: true,
				cats: cats,
			})
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/pages/post/create: Error --> ${err}`
			})
		}
	}
)


// [EXPORT] //
module.exports = router