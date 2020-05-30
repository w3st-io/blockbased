/*** [REQUIRE] ***/
const bcrypt = require("bcryptjs")
const cors = require("cors")
const express = require("express")
const jwt = require("jsonwebtoken")
const mongodb = require('mongodb')

/*** [REQUIRE] Personal ***/
require('dotenv').config()

/*** [USE] ***/
const router = express.Router().use(cors())

/*** [INIT] ***/
const secretKey = process.env.SECRET_KEY || 'secret'

/*** [POST] Login ***/
router.post('/login', async (req, res) => {
	// [INIT] // Get DB Collection //
	const admins = await loadAdminsCollection()

	try {
		// [CHECK FOR EMAIL] //
		const emailFound = await admins.findOne({ email: req.body.email })
		
		// Check if Email Found //
		if (emailFound) {
			// [VALIDATE PASSWORD] //
			if (bcrypt.compareSync(req.body.password, emailFound.password)) {
				// Set Payload Data to Be Sent Back // SEND ADMIN TRUE //
				const payload = {
					_id: emailFound._id,
					username: emailFound.username,
					first_name: emailFound.first_name,
					last_name: emailFound.last_name,
					email: emailFound.email,
				}

				// Set Token //
				let token = jwt.sign(payload, secretKey, { expiresIn: 1440 })

				// [SEND] The login details //
				res.json({ status: 'success', token: token })
					.send()
			}
			else {
				res.json({ status: 'incorrect_password' })
					.send()
			}
		}
		else {
			res.json({ status: 'incorrect_email' })
				.send
		}
	}
	catch (err) { res.send(err) }
})

/*** [POST] Register ***/
router.post("/register", async (req, res) => {
	// [INIT] // Get DB Collection // Get Todays Date // Store "Req" Data //
	const admins = await loadAdminsCollection()
	const today = new Date()
	const userData = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
		created: today
	}

	try {
		// [READ] Retrieve From Collection // Check if Username is Taken //
		const emailFound = await admins.findOne({ email: req.body.email })
		const usernameFound = await admins.findOne({ username: req.body.username })

		if (!emailFound) {
			if (!usernameFound) {
				// Hash Data //
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					userData.password = hash
					
					try {
						// [INSERT] User // Set JSON // [RES SEND] //
						admins.insertOne(userData)
						res.json({ status: 'success' })
							.send()
					}
					catch(err) { res.send('error:', err) }
				})
			}
			else {
				// Set Status in res // [SEND RES]
				res.json({ status: 'username_taken' })
				.send()
			}
		}
		else {
			// Set Status in res // [SEND RES] //
			res.json({ status: 'email_taken' })
				.send()
		}
	}
	catch(err) { res.send(err) }
})

// [FUNCTION] admin Collection in Database //
async function loadAdminsCollection() {
	// [INIT] //
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'db_name'
	const c_name = 'admins'
	
	const client = await mongodb.MongoClient.connect(
		uri,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}	
	)

	// [RETURN] //
	return client.db(db_name).collection(c_name)
}

/*** [EXPORT] ***/
module.exports = router