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


// [INIT] //
const secretKey = process.env.SECRET_KEY || 'secret'


class UsersCollection {
	/******************* [CRUD] *******************/
	// [READ-ALL] //
	static async readAll() {
		try { return await UserModel.find() }
		catch(e) { return `Caught Error --> ${e}` }
	}

	
	// [READ] //
	static async read(user_id) {
		if (mongoose.isValidObjectId(user_id)) {
			try { return await UserModel.findOne({ _id: user_id }) }
			catch(e) { return `Caught Error --> ${e}` }
		}
		else { return 'Invalid ID.' }
	}


	// [UPDATE] Profile Picture //
	static async update(user_id, img_url) {
		if (mongoose.isValidObjectId(user_id)) {
			try {
				await UserModel.findOneAndUpdate(
					{ _id: user_id },
					{ $set: { profileImg: img_url } }
				)

				return {
					status: true,
					user_id: user_id,
					profileImg: img_url,
					message: `Updated profile with id ${user_id}`,
				}
			}
			catch(e) { return `Caught Error --> ${e}` }
		}
		else { return 'Invalid ID.' }
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

					return {
						auth: true,
						status: 'success',
						token: token,
					}
				}
				else {
					return {
						auth: false,
						status: 'incorrect_password'
					}
				}
			}
			else {
				return {
					auth: false,
					status: 'incorrect_email'
				}
			}
		}
		catch(e) {
			return {
				auth: false,
				status: `Caught Error --> ${e}`
			}
		}
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
						if (e) {
							return {
								status: false,
								message: `Caught Error --> ${e}`,
								created: false,
							}
						}

						formData.password = hash
					})
						
					try {
						formData.save()
						return {
							status: true,
							message: 'Successfully created account',
							created: true,
						}
					}
					catch(e) {
						return { status: false, message: `Caught Error --> ${e}`, }
					}
				}
				else {
					return {
						status: true,
						message: 'This email is already registered',
						created: false,
					}
				}
			}
			else {
				return {
					status: true,
					message: 'This username is taken',
					created: false,
				}
			}
		}
		catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
	}


	/******************* [COUNT] *******************/
}


// [EXPORT] //
module.exports = UsersCollection
