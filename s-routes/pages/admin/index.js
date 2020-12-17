/**
 * %%%%%%%%%%%%%%%%%%%
 * %%% ADMIN ROUTE %%%
 * %%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const usersCollection = require('../../../s-collections/usersCollection')
const Auth = require('../../../s-middleware/Auth')
const userUtil = require('../../../s-utils/userUtils')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [READ-ALL] Auth Required //
router.get(
	'/',
	Auth.adminToken(),
	async (req, res) => {
		try {
			const userSockets = userUtil.getAllUserSockets()
			let users = []

			for (let i = 0; i < userSockets.length; i++) {
				let user = await usersCollection.c_readSensitive(
					userSockets[i].user_id,
					'username'
				)

				users.push(user)
			}

			res.status(200).send({
				executed: true,
				status: true,
				users,
			})
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/pages/admin: Error --> ${err}`
			})
		}
	}
)


// [EXPORT] //
module.exports = router