/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% ADMIN ROUTE %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const bcrypt = require('bcryptjs')
const cors = require('cors')
const express = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// [REQUIRE] Personal //
const Collections = require('../../server-collections')


// [INIT] //
const secretKey = process.env.SECRET_KEY || 'secret'


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [ACCOUNT] *******************/
// [LOGIN] //
router.post(
	'/login',
	async (req, res) => {
		const admins = await Collections.loadAdminsCollection()

		try {
			const emailFound = await admins.findOne({ email: req.body.email })
			
			if (emailFound) {
				// [VALIDATE PASSWORD] //
				if (bcrypt.compareSync(req.body.password, emailFound.password)) {
					const payload = {
						_id: emailFound._id,
						email: emailFound.email,
						username: emailFound.username,
						role: emailFound.role,
						first_name: emailFound.first_name,
						last_name: emailFound.last_name,
					}

					// Set Token //
					let token = jwt.sign(payload, secretKey, { expiresIn: 7200 })

					res.json({ status: 'success', token: token }).send()
				}
				else { res.json({ status: 'incorrect_password' }).send() }
			}
			else { res.json({ status: 'incorrect_email' }).send() }
		}
		catch (err) { res.send(err) }
	}
)


// [REGISTER] //
router.post(
	'/register',
	async (req, res) => {
		const admins = await Collections.loadAdminsCollection()
		const today = new Date()
		const userData = {
			//role: 'admin', // Comment about this at the bottom
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
			createdAt: today
		}

		try {
			const usernameFound = await admins.findOne({ username: req.body.username })
			const emailFound = await admins.findOne({ email: req.body.email })

			if (!usernameFound) {
				if (!emailFound) {
					// Hash Data //
					bcrypt.hash(req.body.password, 10, (err, hash) => {
						userData.password = hash
						
						try {
							admins.insertOne(userData)
							res.json({ status: 'success' }).send()
						}
						catch(err) { res.send('error:', err) }
					})
				}
				else { res.json({ status: 'email_taken' }).send() }
			}
			else { res.json({ status: 'username_taken' }).send() }
		}
		catch(err) { res.send(err) }
	}
)


// [EXPORT] //
module.exports = router




/**
 * if you uncomment that then you will allow a REAL admin to be created. 
 */