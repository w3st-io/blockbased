// [REQUIRE] //
const bcrypt = require('bcryptjs')
const cors = require('cors')
const express = require('express')
const jwt = require('jsonwebtoken')
const validator = require('validator')


// [REQUIRE] Personal //
const config = require('../../s-config')
const rateLimiters = require('../../s-rate-limiters')
const adminsCollection = require('../../s-collections/adminsCollection')


// [INIT] //
const secretKey = config.SECRET_KEY


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [LOGIN/REGISTER] *******************/
// [LOGIN] //
router.post(
	'/login',
	async (req, res) => {
		try {
			if (
				validator.isAscii(req.body.email) &&
				validator.isAscii(req.body.password)
			) {

				// [VALIDATE] email //
				if (validator.isEmail(req.body.email)) {
					// [VALIDATE] password //
					if (validator.isAscii(req.body.password)) {
						const userObj = await adminsCollection.c_readByEmail(
							req.body.email
						)

						if (userObj.user) {
							// [VALIDATE-PASSWORD] //
							if (bcrypt.compareSync(req.body.password, userObj.user.password)) {
								const token = jwt.sign(
									{
										admin_id: userObj.user._id,
										role: userObj.user.role,
										email: userObj.user.email,
										username: userObj.user.username,
										first_name: userObj.user.first_name,
										last_name: userObj.user.last_name,
									},
									secretKey,
									{/* expiresIn: 7200 */}
								)
						
								res.status(200).send({
									executed: true,
									status: true,
									message: 'success',
									validation: true,
									token: token,
								})
							}
							else {
								res.status(200).send({
									executed: true,
									status: true,
									message: 'Invalid password',
									validation: false,
								})
							}
						}
						else {
							res.status(200).send({
								executed: true,
								status: true,
								message: 'Invalid email',
								validation: false
							})
						}
					}
					else {
						res.status(200).send({
							executed: true,
							status: false,
							message: '/api/admins/login: Invalid email'
						})
					}
				}
				else {
					res.status(200).send({
						executed: true,
						status: false,
						message: '/api/admins/login: Invalid password'
					})
				}
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/admins/login: Invalid Params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/admins/login: Error --> ${err}`
			})
		}
	}
)


// [REGISTER] //
router.post(
	'/register',
	rateLimiters.registrationLimiter,
	async (req, res) => {
		try {
			if (
				validator.isAscii(req.body.username) &&
				validator.isAscii(req.body.email) &&
				validator.isAscii(req.body.password)
			) {
				const returned = await adminsCollection.c_register(
					req.body.username,
					req.body.email,
					req.body.password,
				)

				res.status(200).send(returned)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/admins/register: Invalid Params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/admins/register: Error --> ${err}`,
			})
		}
	}
)


// [EXPORT] //
module.exports = router