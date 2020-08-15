/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% ADMIN ROUTE %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const rateLimiters = require('../../rate-limiters')
const adminsCollection = require('../../server-collections/adminsCollection')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [LOGIN/REGISTER] *******************/
// [LOGIN] //
router.post(
	'/login',
	async (req, res) => {
		const returnedData = await adminsCollection.c_login(
			req.body.email,
			req.body.password
		)

		res.status(200).send(returnedData)
	}
)

// [REGISTER] //
router.post(
	'/register',
	rateLimiters.registrationlimiter,
	async (req, res) => {
		const returnedData = await adminsCollection.c_register(req)

		console.log('RETURNED DATA', returnedData)

		res.status(201).send(returnedData)
	}
)


// [EXPORT] //
module.exports = router