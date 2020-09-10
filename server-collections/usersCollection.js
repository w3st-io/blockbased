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
const c_read = async (_id) => {
	// [VALIDATE] //
	if (!mongoose.isValidObjectId(_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid user _id'
		}
	}

	try {
		const user = await UserModel.findOne({ _id: _id })

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


// [UPDATE] Profile Picture //
const c_update = async (_id, img_url) => {
	if (!mongoose.isValidObjectId(_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid user _id'
		}
	}

	try {
		const updatedUser = await UserModel.findOneAndUpdate(
			{ _id: _id },
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


/******************* [OTHER-CRUD] *******************/
const c_getIdByEmail = async (email) => {
	try {
		const user = await UserModel.findOne({ email: email })

		if (user) {
			return {
				executed: true,
				status: true,
				user: user
			}
		}
		else {
			return {
				executed: true,
				status: false,
				message: 'No user found'
			}
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


/******************* [LOGIN/REGISTER] *******************/
const c_login = async (email, password) => {
	try {
		// [VALIDATE-EMAIL] //
		const userFound = await UserModel.findOne({ email: email })
		
		if (!userFound) {
			return {
				executed: true,
				status: true,
				message: 'Invalid email or password',
				validation: false
			}
		}

		// [VALIDATE PASSWORD] //
		if (!bcrypt.compareSync(password, userFound.password)) {
			return {
				executed: true,
				status: true,
				message: 'Invalid email or password',
				validation: false,
			}
		}

		const payload = {
			_id: userFound._id,
			email: userFound.email,
			username: userFound.username,
			first_name: userFound.first_name,
			last_name: userFound.last_name,
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
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `usersCollection: Error --> ${err}`
		}
	}
}


const c_register = async (req) => {
	try {
		// Username Check //
		const usernameFound = await UserModel.findOne({ username: req.body.username })

		if (usernameFound) {
			return {
				executed: true,
				status: true,
				message: 'This username is taken',
				created: false,
			}
		}

		// Email Check //
		const emailFound = await UserModel.findOne({ email: req.body.email })

		if (emailFound) {
			return {
				executed: true,
				status: true,
				message: 'This email is already registered',
				created: false,
			}
		}

		// Password Length //
		if (req.body.password.length < 8 || req.body.password.length > 50) {
			return {
				executed: true,
				status: false,
				message: 'Password invalid (8 < password < 50)',
				created: false,
			}
		}

		try {
			// Hash Password //
			const hashedPassword = await bcrypt.hash(req.body.password, 10)

			// [SAVE] //
			const createdUser = await new UserModel({
				_id: mongoose.Types.ObjectId(),
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				username: req.body.username,
				email: req.body.email,
				password: hashedPassword,
			}).save()
			
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
const c_verify = async (_id) => {
	if (mongoose.isValidObjectId(_id)) {
		try {
			const user = await UserModel.findOneAndUpdate(
				{ _id: _id },
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


const c_verifiedStatus = async (_id) => {
	if (mongoose.isValidObjectId(_id)) {
		try {
			const user = await UserModel.findOne(
				{
					_id: _id,
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
	if (mongoose.isValidObjectId(_id)) {
		// Hash Password //
		password = await bcrypt.hash(password, 10)
		console.log('Hashed Password:', password)

		
		// [UPDATE] Password for User //
		try {
			const updatedUser = await UserModel.findOneAndUpdate(
				{ _id: _id },
				{ $set: { password: password } }
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


// [EXPORT] //
module.exports = {
	c_readAll,
	c_read,
	c_update,
	c_getIdByEmail,
	c_login,
	c_register,
	c_verify,
	c_verifiedStatus,
	c_updatePassword,
}