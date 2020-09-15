/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% USER ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const usersCollection = require('../../../../server-collections/usersCollection')
const Auth = require('../../../../server-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/
// [READ] Auth Required - Decoded //
router.get(
	'/',
	Auth.userToken(),
	async (req, res) => {
		const returned = await usersCollection.c_read(req.decoded._id)

		res.status(200).send(returned)
	}
)


// [EXPORT] //
module.exports = router