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
const rateLimiters = require('../../s-rate-limiters')
const adminsCollection = require('../../s-collections/adminsCollection')


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
			try {
				const returned = await adminsCollection.c_login(
					req.body.email,
					req.body.password
				)

				res.status(200).send(returned)
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/admins: Error --> ${err}`
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: '/api/admins: Invalid Params'
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
			try {
				const returned = await adminsCollection.c_register(
					req.body.first_name,
					req.body.last_name,
					req.body.username,
					req.body.email,
					req.body.password,
				)

				res.status(201).send(returned)
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/admins: Error --> ${err}`,
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: '/api/admins: Invalid Params'
			})
		}
	}
)


// [EXPORT] //
module.exports = router