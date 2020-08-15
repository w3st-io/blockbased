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
const AdminsCollection = require('../../server-collections/AdminsCollection')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [LOGIN/REGISTER] *******************/
// [LOGIN] //
router.post(
	'/login',
	async (req, res) => {
		const returnedData = await AdminsCollection.c_login(
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
		const returnedData = await AdminsCollection.c_register(req)

		console.log('RETURNED DATA', returnedData)

		res.status(201).send(returnedData)
	}
)


// [EXPORT] //
module.exports = router