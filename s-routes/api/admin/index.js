// [REQUIRE] //
const bcrypt = require('bcryptjs')
const cors = require('cors')
const express = require('express')
const jwt = require('jsonwebtoken')
const validator = require('validator')


// [REQUIRE] Personal //
const config = require('../../../s-config')
const rateLimiters = require('../../../s-rate-limiters')
const adminsCollection = require('../../../s-collections/adminsCollection')


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
				// [VALIDATE] email // [VALIDATE] password //
				if (validator.isEmail(req.body.email)) {
					if (validator.isAscii(req.body.password)) {
						const userObj = await adminsCollection.c_readByEmail(
							req.body.email
						)

						if (userObj.user) {
							// [VALIDATE-PASSWORD] //
							if (
								bcrypt.compareSync(
									req.body.password,
									userObj.user.password
								)
							) {
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
						
								res.send({
									executed: true,
									status: true,
									validation: true,
									token: token,
									location: '/api/admin/login',
									message: 'success',
								})
							}
							else {
								res.send({
									executed: true,
									status: true,
									validation: false,
									location: '/api/admin/login',
									message: 'Invalid password',
								})
							}
						}
						else {
							res.send({
								executed: true,
								status: true,
								validation: false,
								location: '/api/admin/login',
								message: 'Invalid email',
							})
						}
					}
					else {
						res.send({
							executed: true,
							status: false,
							location: '/api/admin/login',
							message: 'Invalid email'
						})
					}
				}
				else {
					res.send({
						executed: true,
						status: false,
						location: '/api/admin/login',
						message: 'Invalid password',
					})
				}
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/admin/login',
					message: 'Invalid Params'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/admin/login',
				message: `Caught Error --> ${err}`,
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

				res.send(returned)
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/admin/register',
					message: 'Invalid Params'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/admin/register',
				message: `Caught Error --> ${err}`,
			})
		}
	}
)


module.exports = router