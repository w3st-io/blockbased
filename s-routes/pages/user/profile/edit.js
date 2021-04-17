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
				user_id: req.decoded.user_id,
				select: '_id first_name last_name username bio verified created_at profile_img'
			})

			res.status(200).send(userObj)
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/user/read: Error --> ${err}`,
			})
		}
	}
)


module.exports = router