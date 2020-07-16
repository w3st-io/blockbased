/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% USERS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
require('dotenv').config()


// [REQUIRE] Personal //
const UserModel = require('../server-models/UserModel')


// [MONGOOSE CONNECT] //
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})


// [INIT] //
const secretKey = process.env.SECRET_KEY || 'secret'


class UsersCollection {
	/******************* [CRUD] *******************/
	// [READ-ALL] //
	static async readAll(req) {
		try {
			const returnedData = await UserModel.find()

			return returnedData
		}
		catch(e) { return `Caught Error: ${e}` }
	}

	
	// [READ] //
	static async read(req) {
		const validId = mongoose.isValidObjectId(req.params._id)

		if (validId) {
			try {
				const returnedData = await UserModel.findOne(
					{ _id: mongoose.Types.ObjectId(req.params._id) }
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
			const returnedData = await UserModel.findOne(
				{ _id: req.decoded._id }
			)

			return returnedData
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	// [UPDATE] Profile Picture //
	static async update(req) {
		const validId = mongoose.isValidObjectId(req.params._id)

		if (validId) {
			try {
				await UserModel.findOneAndUpdate(
					{ _id: req.params._id },
					{ $set: { profileImg: req.body.img_url } }
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
			await UserModel.findOneAndUpdate(
				{ _id: req.decoded._id },
				{ $set: { profileImg: req.body.img_url } }
			)

			return
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	/******************* [LOGIN/REGISTER] *******************/
	static async login(req) {

		try {
			const accountFound = await UserModel.findOne({ email: req.body.email })
			
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
					const token = jwt.sign(payload, secretKey, {})

					return { auth: true, status: 'success', token: token, }
				}
				else { return { auth: false, status: 'incorrect_password' } }
			}
			else { return { auth: false, status: 'incorrect_email' } }
		}
		catch(e) { return { auth: false, status: `Caught Error: ${e}` } }
	}


	static async register(req) {
		let formData = new UserModel({
			_id: mongoose.Types.ObjectId(),
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
		})
		
		try {
			const usernameFound = await UserModel.findOne({ username: formData.username })
			const emailFound = await UserModel.findOne({ email: formData.email })

			if (!usernameFound) {
				if (!emailFound) {
					// Hash Data //
					bcrypt.hash(formData.password, 10, (e, hash) => {
						if (e) { return { status: `Caught Error: ${e}` } }

						formData.password = hash
						
						try { formData.save() }
						catch(e) { return { status: `Caught Error: ${e}` } }
					})

					return { status: 'success' }
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
