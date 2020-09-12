/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% ADMIN ROUTE %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


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
		if (
			validator.isAscii(req.body.email) &&
			validator.isAscii(req.body.password)
		) {
			const returned = await adminsCollection.c_login(
				req.body.email,
				req.body.password
			)

			res.status(200).send(returned)
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'Invalid Params'
			})
		}
	}
)

// [REGISTER] //
router.post(
	'/register',
	rateLimiters.registrationLimiter,
	async (req, res) => {
		if (
			validator.isAscii(req.body.first_name) &&
			validator.isAscii(req.body.last_name) &&
			validator.isAscii(req.body.username) &&
			validator.isAscii(req.body.email) &&
			validator.isAscii(req.body.password)
		) {
			const returned = await adminsCollection.c_register(req)

			res.status(201).send(returned)
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'Invalid Params'
			})
		}
	}
)


// [EXPORT] //
module.exports = router