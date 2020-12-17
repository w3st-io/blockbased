/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%
 * %%% USER PROFILE PAGE %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const usersCollection = require('../../../../s-collections/usersCollection')
const Auth = require('../../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/

// [READ] Auth Required - Decoded //
router.get(
	'/',
	Auth.userTokenByPassVerification(),
	async (req, res) => {
		try {
			const userObj = await usersCollection.c_readSensitive(req.decoded.user_id)
			
			res.status(200).send(userObj)
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/pages/user/profile: Error --> ${err}`
			})
		}
	}
)


// [EXPORT] //
module.exports = router