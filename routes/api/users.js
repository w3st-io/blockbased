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


// [USE] //
const router = express.Router().use(cors())


// [INIT] //
const secretKey = process.env.SECRET_KEY || 'secret'


/******************* [USER PROFILE] *******************/
// [READ] //
router.get('/read/profile-data/:_id', async (req, res) => {
	const users = await Collections.loadUsersCollection()
	let retrievedData = await users.findOne(
		{ _id: new mongodb.ObjectID(req.params._id) }
	)
	
	res.status(201).send(retrievedData)
})


// [READ] Profile Image //
router.get('/read/profile-data/profile-pic-url/:_id', async (req, res) => {
	const users = await Collections.loadUsersCollection()
	let retrievedData = await users.findOne(
		{ _id: new mongodb.ObjectID(req.params._id) },
		{ projection: { profilePicURL: 1 } }
	)
	res.status(201).send(retrievedData)
})


// [UPDATE] //
router.post('/update/profile-data/:_id', async (req, res) => {
	const users = await Collections.loadUsersCollection()
	await users.findOneAndUpdate(
		{ _id: new mongodb.ObjectID(req.params._id) },
		{
			$set: {
				profilePicURL: req.body.img_url,
				
			}
		},
		{ upsert: true }
	)

	res.status(201).send()
})


/******************* [USER LOGIN/REGISTER] *******************/
// [LOGIN] //
router.post('/login', async (req, res) => {
	const users = await Collections.loadUsersCollection()

	try {
		const emailFound = await users.findOne({ email: req.body.email })
		
		// [VALIDATE ACCOUNT] --> [VALIDATE PASSWORD] //
		if (emailFound) {
			if (bcrypt.compareSync(req.body.password, emailFound.password)) {
				const payload = {
					_id: emailFound._id,
					email: emailFound.email,
					username: emailFound.username,
					first_name: emailFound.first_name,
					last_name: emailFound.last_name,
				}

				// Set Token //
				let token = jwt.sign(payload, secretKey, { expiresIn: 7200 })

				res.status(201).json({ status: 'success', token: token }).send()
			}
			else { res.json({ status: 'incorrect_password' }).send() }
		}
		else { res.json({ status: 'incorrect_email' }).send }
	}
	catch (err) { res.send(err) }
})


// [REGISTER] //
router.post("/register", async (req, res) => {
	const users = await Collections.loadUsersCollection()
	const userData = new UserModel(req.body)
	
	try {
		const emailFound = await users.findOne({ email: userData.email })
		const usernameFound = await users.findOne({ username: userData.username })

		if (!emailFound) {
			if (!usernameFound) {
				// Hash Data //
				bcrypt.hash(userData.password, 10, (err, hash) => {
					userData.password = hash
					
					try {
						users.insertOne(userData)
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
})


// [EXPORT] //
module.exports = router