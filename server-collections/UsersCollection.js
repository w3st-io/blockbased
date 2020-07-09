/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% USERS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongodb = require('mongodb')
require('dotenv').config()


// [REQUIRE] Personal //
const UserModel = require('../models/UserModel')


// [INIT] //
const secretKey = process.env.SECRET_KEY || 'secret'


// [LOAD COLLECTION] users //
async function loadUsersCollection() {
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

	return client.db(db_name).collection(c_name)
}


class UsersCollection {
	/******************* [CRRUD] *******************/
	// [READ] //
	static read() {
		return async (req, res, next) => {
			const user_id = req.decoded._id
			
			try {
				const users = await loadUsersCollection()
				const retrievedData = await users.findOne({
					_id: new mongodb.ObjectID(user_id)
				})

				if (retrievedData) { req.retrievedData = retrievedData }
				else { req.retrievedData = '' }

				next()
			}
			catch(e) {
				res.status(400).send({
					auth: true,
					message: `Caught Error: ${e}`,
				})
			}
		}
	}


	// [READ] Profile Image //
	static readProfilePic() {
		return async (req, res, next) => {
			try {
				const users = await loadUsersCollection()
				const retrievedData = await users.findOne(
					{ _id: new mongodb.ObjectID(req.params._id) },
					{ projection: { profilePicURL: 1 } }
				)

				if (retrievedData) { req.retrievedData = retrievedData }
				else { req.retrievedData = '' }

				next()
			}
			catch(e) {
				res.status(400).send({
					auth: true,
					message: `Caught Error: ${e}`,
				})
			}
		}
	}


	// [UPDATE] //
	static update() {
		return async (req, res, next) => {
			try {
				const users = await loadUsersCollection()
				await users.findOneAndUpdate(
					{ _id: new mongodb.ObjectID(req.decoded._id) },
					{
						$set: {
							profilePicURL: req.body.img_url,
							
						}
					},
					{ upsert: true }
				)

				next()
			}
			catch(e) {
				res.status(400).send({
					auth: true,
					message: `Caught Error: ${e}`,
				})
			}
		}
	}


	/******************* [USER LOGIN/REGISTER] *******************/
	static login() {
		return async (req, res, next) => {
			const users = await loadUsersCollection()

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
				else { res.json({ status: 'incorrect_email' }).send() }
			}
			catch (err) { res.send(err) }
		}
	}


	static register() {
		return async (req, res, next) => {
			const users = await loadUsersCollection()
			const formData = new UserModel(req.body)
			
			try {
				const accountFound = await users.findOne({
					email: formData.email
				})
				const usernameFound = await users.findOne({
					username: formData.username
				})

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
	}

	/******************* [COUNT] *******************/
}


// [EXPORT] //
module.exports = UsersCollection
