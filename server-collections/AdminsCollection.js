/**
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongodb = require('mongodb')
require('dotenv').config()


// [INIT] //
const secretKey = process.env.SECRET_KEY || 'secret'


// [LOAD COLLECTION] blocks //
async function loadAdminsCollection() {
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

	return client.db(db_name).collection(c_name)
}


class BlocksCollection {
	/******************* [LOGIN/REGISTER] *******************/
	static login() {
		return async (req, res, next) => {
			const admins = await loadAdminsCollection()

			try {
				const accountFound = await admins.findOne({ email: req.body.email })
				
				// [VALIDATE ACCOUNT] --> [VALIDATE PASSWORD] //
				if (accountFound) {
					if (bcrypt.compareSync(req.body.password, accountFound.password)) {
						const payload = {
							_id: accountFound._id,
							role: accountFound.role,
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
				else { res.json({ status: 'incorrect_email' }).send() }
			}
			catch (err) { res.send(err) }
		}
	}


	// [REGISTER] //
	static register() {
		return async (req, res, next) => {
			const admins = await loadAdminsCollection()
			const today = new Date()
			const formData = {
				//role: 'admin', /** Comment about this at the bottom **/
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				email: req.body.email,
				username: req.body.username,
				password: req.body.password,
				createdAt: today
			}

			try {
				const usernameFound = await admins.findOne({
					username: req.body.username
				})
				const emailFound = await admins.findOne({
					email: req.body.email
				})

				if (!usernameFound) {
					if (!emailFound) {
						// Hash Data //
						bcrypt.hash(req.body.password, 10, (err, hash) => {
							formData.password = hash
							
							try {
								admins.insertOne(formData)
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
	}
}


// [EXPORT] //
module.exports = BlocksCollection



/**
 * if you uncomment that then you will allow a REAL admin to be created. 
 */