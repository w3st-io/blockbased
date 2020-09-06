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


/******************* [CRUD] *******************/
// [READ-ALL] //
const c_readAll = async () => {
	try {
		const users = await UserModel.find()

		return {
			executed: true,
			status: true,
			users: users
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserCollection: Error --> ${err}`
		}
	}
}


// [READ] //
const c_read = async (user_id) => {
	if (mongoose.isValidObjectId(user_id)) {
		try {
			const user = await UserModel.findOne({ _id: user_id })

			return {
				executed: true,
				status: true,
				user: user
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `UserCollection: Error --> ${err}`
			}
		}
	}
	else {
		return {
			executed: true,
			status: false,
			message: 'Invalid user _id'
		}
	}
}


// [UPDATE] Profile Picture //
const c_update = async (user_id, img_url) => {
	if (mongoose.isValidObjectId(user_id)) {
		try {
			const updatedUser = await UserModel.findOneAndUpdate(
				{ _id: user_id },
				{ $set: { profileImg: img_url } }
			)

			return {
				executed: true,
				status: true,
				message: 'Updated profile',
				updatedUser: updatedUser
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `usersCollection: Error --> ${err}`
			}
		}
	}
	else {
		return {
			executed: true,
			status: false,
			message: 'Invalid user _id'
		}
	}
}


/******************* [LOGIN/REGISTER] *******************/
const c_login = async (email, password) => {
	try {
		const accountFound = await UserModel.findOne({ email: email })
		
		// [VALIDATE ACCOUNT] --> [VALIDATE PASSWORD] //
		if (accountFound) {
			if (bcrypt.compareSync(password, accountFound.password)) {
				const payload = {
					_id: accountFound._id,
					email: accountFound.email,
					username: accountFound.username,
					first_name: accountFound.first_name,
					last_name: accountFound.last_name,
				}

				// Set Token //
				let token = jwt.sign(payload, secretKey, {/*  expiresIn: 7200  */})

				return {
					executed: true,
					status: true,
					message: 'success',
					validation: true,
					token: token,
				}
			}
			else {
				return {
					executed: true,
					status: true,
					message: 'Invalid email or password',
					validation: false,
				}
			}
		}
		else {
			return {
				executed: true,
				status: true,
				message: 'Invalid email or password',
				validation: false
			}
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `usersCollection: Error --> ${err}`
		}
	}
}


const c_register = async (req) => {
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
				try {
					// Hash Password //
					formData.password = await bcrypt.hash(formData.password, 10)
					
					const createdUser = await formData.save()
					
					return {
						executed: true,
						status: true,
						message: 'Successfully created account',
						created: true,
						createdUser: createdUser,
					}
				}
				catch (err) {
					return {
						executed: false,
						status: false,
						message: `usersCollection: Error --> ${err}`,
						created: false,
					}
				}
			}
			else {
				return {
					executed: true,
					status: true,
					message: 'This email is already registered',
					created: false,
				}
			}
		}
		else {
			return {
				executed: true,
				status: true,
				message: 'This username is taken',
				created: false,
			}
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `usersCollection: Error --> ${err}`,
			created: false,
		}
	}
}


/******************* [VERIFY] *******************/
const c_verify = async (user_id) => {
	if (mongoose.isValidObjectId(user_id)) {
		try {
			const user = await UserModel.findOneAndUpdate(
				{ _id: user_id },
				{ $set: { verified: true } }
			)

			return {
				executed: true,
				status: true,
				message: 'Verified profile',
				user: user
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `usersCollection: Error --> ${err}`
			}
		}
	}
	else {
		return {
			executed: true,
			status: false,
			message: 'Invalid user _id'
		}
	}
}


const c_verifiedStatus = async (user_id) => {
	if (mongoose.isValidObjectId(user_id)) {
		try {
			const user = await UserModel.findOne(
				{
					_id: user_id,
					verified: true,
				}
			)

			if (user) {
				return {
					executed: true,
					status: true,
					message: 'User verified',
					user: user,
				}
			}
			else {
				return {
					executed: true,
					status: false,
					message: 'User NOT verified',
					user: user,
				}
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `usersCollection: Error --> ${err}`,
			}
		}
	}
	else {
		return {
			executed: true,
			status: false,
			message: 'Invalid user _id',
		}
	}
}


/******************* [VERIFY] *******************/
const c_updatePassword = async (_id, password) => {
	// Hash Password //
	password = await bcrypt.hash(password, 10)

	console.log('hashed password:', password)

	// [UPDATE] Password for User //
}


// [EXPORT] //
module.exports = {
	c_readAll,
	c_read,
	c_update,
	c_login,
	c_register,
	c_verify,
	c_verifiedStatus,
	c_updatePassword,
}