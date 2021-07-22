// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const usersCollection = require('../../../../s-collections/usersCollection')
const Auth = require('../../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/',
	Auth.userTokenByPassVerification(),
	async (req, res) => {
		try {
			const userObj = await usersCollection.c_readSelect({
				user_id: req.user_decoded.user_id,
				select: '_id first_name last_name username bio verified created_at profile_img'
			})

			res.send(userObj)
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/read',
				message: `Caught Error --> ${err}`,
			})
		}
	}
)


module.exports = router