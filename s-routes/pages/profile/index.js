/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% USER ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const usersCollection = require('../../../s-collections/usersCollection')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/

// [READ] Auth Required - Decoded //
router.get(
	'/',
	Auth.userToken(),
	async (req, res) => {
		try {
			const returned = await usersCollection.c_read(req.decoded.user_id)

			res.status(200).send(returned)
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/pages/profile: Error --> ${err}`
			})
		}
	}
)


// [EXPORT] //
module.exports = router