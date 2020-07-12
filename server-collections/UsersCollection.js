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
	// [READ-ALL] //
	static async readAll(req) {
		try {
			const users = await loadUsersCollection()
			const returnedData = await users.find().toArray()

			return returnedData
		}
		catch(e) { return `Caught Error: ${e}` }
	}

	
	// [READ] //
	static async read(req) {
		const validId = mongodb.ObjectID.isValid(req.params._id)

		if (validId) {
			try {
				const users = await loadUsersCollection()
				const returnedData = await users.findOne(
					{ _id: new mongodb.ObjectID(req.params._id) }
				)

				return returnedData
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid ID.' }
	}


	// [READ] Decoded //
	static async readDecoded(req) {
		try {
			const users = await loadUsersCollection()
			const returnedData = await users.findOne(
				{ _id: new mongodb.ObjectID(req.decoded._id) }
			)

			return returnedData
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	// [READ] Profile Image //
	static async readProfilePic(req) {
		const validId = mongodb.ObjectID.isValid(req.params._id)

		if (validId) {
			try {
				const users = await loadUsersCollection()
				const returnedData = await users.findOne(
					{ _id: new mongodb.ObjectID(req.params._id) },
					{ projection: { profilePicURL: 1 } }
				)

				return returnedData
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid ID.' }
	}


	// [UPDATE] Profile Picture //
	static async update() {
		const validId = mongodb.ObjectID.isValid(req.params._id)

		if (validId) {
			try {
				const users = await loadUsersCollection()
				await users.findOneAndUpdate(
					{ _id: new mongodb.ObjectID(req.params._id) },
					{ $set: { profilePicURL: req.body.img_url, } },
					{ upsert: true }
				)

				return
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid ID.' }
	}


	// [UPDATE] Decoded - Profile Picture //
	static async updateDecoded(req) {
		try {
			const users = await loadUsersCollection()
			await users.findOneAndUpdate(
				{ _id: new mongodb.ObjectID(req.decoded._id) },
				{ $set: { profilePicURL: req.body.img_url, } },
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


	/******************* [LOGIN/REGISTER] *******************/
	static async login() {
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
					res.token = jwt.sign(payload, secretKey, {})

					return {
						auth: true,
						status: 'success',
						token: token,
					}
				}
				else { return { auth: false, status: 'incorrect_password' } }
			}
			else { return { auth: false, status: 'incorrect_email' } }
		}
		catch(e) { return { auth: false, status: `Caught Error: ${e}` } }
	}


	static async register(req) {
		const users = await loadUsersCollection()
		const formData = new UserModel(req.body)
		
		try {
			const emailFound = await users.findOne({
				email: formData.email
			})
			const usernameFound = await users.findOne({
				username: formData.username
			})

			if (!usernameFound) {
				if (!emailFound) {
					// Hash Data //
					bcrypt.hash(formData.password, 10, (err, hash) => {
						formData.password = hash
					})

					try {
						users.insertOne(formData)
						
						return { status: 'success' }
					}
					catch(e) { return { status: `Caught Error: ${e}` } }
				}
				else { return { status: 'email_taken' } }
			}
			else { return { status: 'username_taken' } }
		}
		catch(e) { return { status: `Caught Error: ${e}` } }
	}


	/******************* [COUNT] *******************/
}


// [EXPORT] //
module.exports = UsersCollection
