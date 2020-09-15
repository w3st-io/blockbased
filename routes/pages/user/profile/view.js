/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% USER ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const rateLimiters = require('../../../../rate-limiters')
const passwordRecoveriesCollection = require('../../../../server-collections/passwordRecoveriesCollection')
const usersCollection = require('../../../../server-collections/usersCollection')
const verificationCodesCollection = require('../../../../server-collections/verificationCodesCollection')
const Auth = require('../../../../server-middleware/Auth')
const mailerUtil = require('../../../../utils/mailerUtil')


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