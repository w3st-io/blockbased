/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% USER ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const bcrypt = require('bcryptjs')
const cors = require('cors')
const express = require('express')
const jwt = require('jsonwebtoken')
const mongodb = require('mongodb')
require('dotenv').config()


// [REQUIRE] Personal //
const UserModel = require('../../models/UserModel')
const Collections = require('../../server-collections')
const Auth = require('../../server-middleware/AuthMiddleware')


// [INIT] //
const secretKey = process.env.SECRET_KEY || 'secret'


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/
// [READ] //
router.get(
	'/read/profile-data',
	Auth.userTokenCheck(),
	async (req, res) => {
		const user_id = req.decoded._id
		const users = await Collections.loadUsersCollection()
		let retrievedData = await users.findOne(
			{ _id: new mongodb.ObjectID(user_id) }
		)
		
		res.status(201).send(retrievedData)
	}
)


// [READ] Profile Image //
router.get(
	'/read/profile-data/profile-pic-url/:_id',
	async (req, res) => {
		const users = await Collections.loadUsersCollection()
		let retrievedData = await users.findOne(
			{ _id: new mongodb.ObjectID(req.params._id) },
			{ projection: { profilePicURL: 1 } }
		)
		res.status(201).send(retrievedData)
	}
)


// [UPDATE] //
router.post(
	'/update/profile-data',
	Auth.userTokenCheck(),
	async (req, res) => {
		const users = await Collections.loadUsersCollection()
		await users.findOneAndUpdate(
			{ _id: new mongodb.ObjectID(req.decoded._id) },
			{
				$set: {
					profilePicURL: req.body.img_url,
					
				}
			},
			{ upsert: true }
		)

		res.status(201).send()
	}
)


/******************* [USER LOGIN/REGISTER] *******************/
// [LOGIN] //
router.post(
	'/login',
	async (req, res) => {
		const users = await Collections.loadUsersCollection()

		try {
			const accountFound = await users.findOne({ email: req.body.email })
			
			// [VALIDATE ACCOUNT] --> [VALIDATE PASSWORD] //
			if (accountFound) {
				if (bcrypt.compareSync(req.body.password, accountFound.password)) {
					const payload = {
						_id: accountFound._id,
						email: accountFound.email,
						username: accountFound.username,
						first_name: accountFound.first_name,
						last_name: accountFound.last_name,
					}

					// Set Token //
					//let token = jwt.sign(payload, secretKey, { expiresIn: 7200 })
					let token = jwt.sign(payload, secretKey, {})

					res.status(201).json({ status: 'success', token: token }).send()
				}
				else { res.json({ status: 'incorrect_password' }).send() }
			}
			else { res.json({ status: 'incorrect_email' }).send }
		}
		catch (err) { res.send(err) }
	}
)


// [REGISTER] //
router.post(
	'/register',
	async (req, res) => {
		const users = await Collections.loadUsersCollection()
		const formData = new UserModel(req.body)
		
		try {
			const accountFound = await users.findOne({ email: formData.email })
			const usernameFound = await users.findOne({ username: formData.username })

			if (!accountFound) {
				if (!usernameFound) {
					// Hash Data //
					bcrypt.hash(formData.password, 10, (err, hash) => {
						formData.password = hash
						
						try {
							users.insertOne(formData)
							res.json({ status: 'success' }).send()
						}
						catch(err) { res.send('error:', err) }
					})
				}
				else { res.json({ status: 'username_taken' }).send() }
			}
			else { res.json({ status: 'email_taken' }).send() }
		}
		catch(err) { res.send(err) }
	}
)


// [EXPORT] //
module.exports = router