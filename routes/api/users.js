/*** [REQUIRE] ***/
const bcrypt = require("bcryptjs")
const cors = require("cors")
const express = require("express")
const jwt = require("jsonwebtoken")
const mongodb = require('mongodb')

/*** [REQUIRE] Personal ***/
const UserModel = require('../../models/UserModel')
require('dotenv').config()

/*** [USE] ***/
const router = express.Router().use(cors())

/*** [INIT] ***/
const secretKey = process.env.SECRET_KEY || 'secret'

/*** [POST] Login ***/
router.post('/login', async (req, res) => {
	// [INIT] // Get DB Collection //
	const users = await loadUsersCollection()

	try {
		// [CHECK FOR EMAIL] //
		const emailFound = await users.findOne({ email: req.body.email })
		
		// [VALIDATE ACCOUNT] --> [VALIDATE PASSWORD] //
		if (emailFound) {
			if (bcrypt.compareSync(req.body.password, emailFound.password)) {
				// Set Payload Data to Be Sent Back //
				const payload = {
					_id: emailFound._id,
					first_name: emailFound.first_name,
					last_name: emailFound.last_name,
					username: emailFound.username,
					email: emailFound.email,
				}

				// Set Token //
				let token = jwt.sign(payload, secretKey, { expiresIn: 1440 })

				// [SEND] The login details //
				res.json({ status: 'success', token: token }).send()
			}
			else { res.json({ status: 'incorrect_password' }).send() }
		}
		else { res.json({ status: 'incorrect_email' }).send }
	}
	catch (err) { res.send(err) }
})

/*** [POST] Register ***/
router.post("/register", async (req, res) => {
	// [INIT] // Get DB Collection // Get Todays Date // Store "Req" Data //
	const users = await loadUsersCollection()
	const userData = new UserModel(req.body)
	
	try {
		// [READ] Retrieve From Collection // Check if Email is taken //
		const emailFound = await users.findOne({ email: userData.email })
		const usernameFound = await users.findOne({ username: userData.username })

		if (!emailFound) {
			if (!usernameFound) {
				// Hash Data //
				bcrypt.hash(userData.password, 10, (err, hash) => {
					userData.password = hash
					
					try {
						// [INSERT] User // Set JSON // [RES SEND] //
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

// [FUNCTION] User Collection in Database //
async function loadUsersCollection() {
	// [INIT] //
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'db_name'
	const c_name = 'users'
	
	const client = await mongodb.MongoClient.connect(
		uri,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}	
	)
		console.log('dfsdf',db_name)
	// [RETURN] //
	return client.db(db_name).collection(c_name)
}

/*** [EXPORT] ***/
module.exports = router