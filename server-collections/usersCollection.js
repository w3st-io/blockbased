/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% USERS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const validator = require('validator')
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
			message: 'Invalid _id'
		}
	}

	try {
		const user = await UserModel.findOne({ _id })

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
	// [VALIDATE] //
	if (!mongoose.isValidObjectId(_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid user _id'
		}
	}

	// [VALIDATE] img_url //
	if (!validator.isAscii(img_url)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid img_url'
		}
	}

	try {
		const updatedUser = await UserModel.findOneAndUpdate(
			{ _id },
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
	// [VALIDATE] Email //
	if (!validator.isEmail(email)) {
		return {
			executed: true,
			status: false,
			message: 'usersCollection: Invalid email'
		}
	}

	try {
		const user = await UserModel.findOne({ email })

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


const c_updatePassword = async (_id, password) => {
	// [VALIDATE] //
	if (!mongoose.isValidObjectId(_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid user _id'
		}
	}
	
	// [VALIDATE] password //
	if (!validator.isAscii(password)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid password'
		}
	}

	// Hash Password //
	const hashedPassword = await bcrypt.hash(password, 10)

	
	// [UPDATE] Password for User //
	try {
		const user = await UserModel.findOneAndUpdate(
			{ _id },
			{ $set: { password: hashedPassword } }
		)

		return {
			executed: true,
			status: true,
			message: 'Updated profile',
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


/******************* [LOGIN/REGISTER] *******************/
const c_login = async (email, password) => {
	// [VALIDATE] email //
	if (!validator.isEmail(email)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid email'
		}
	}
	else { email = validator.normalizeEmail(email) }
	
	// [VALIDATE] password //
	if (!validator.isAscii(password)) {
		return {
			executed: true,
			status: false,
			message: 'usersCollection: Invalid password'
		}
	}

	try {
		// [VALIDATE-EMAIL] //
		const userFound = await UserModel.findOne({ email })
		
		if (!userFound) {
			return {
				executed: true,
				status: true,
				message: 'Invalid emailor password',
				validation: false
			}
		}

		// [VALIDATE-PASSWORD] //
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


const c_register = async (username, email, password) => {
	// [VALIDATE] //
	if (!validator.isAscii(username) || !validator.isAscii(password)) {
		return {
			executed: true,
			status: false,
			message: 'usersCollection: Invalid params'
		}
	}

	// [VALIDATE] email //
	if (!validator.isEmail(email)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid email'
		}
	}
	else { email = validator.normalizeEmail(email) }

	try {
		// Username Check //
		if (await UserModel.findOne({ username })) {
			return {
				executed: true,
				status: true,
				message: 'That username is taken',
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

	try {
		// Email Check //
		if (await UserModel.findOne({ email })) {
			return {
				executed: true,
				status: true,
				message: 'That email is already registered',
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

	// Password Length //
	if (password.length < 8 || password.length > 50) {
		return {
			executed: true,
			status: false,
			message: 'Password invalid (8 < password < 50)',
			created: false,
		}
	}

	try {
		// Hash Password //
		const hashedPassword = await bcrypt.hash(password, 10)

		// [SAVE] //
		const user = await new UserModel({
			_id: mongoose.Types.ObjectId(),
			username,
			email,
			password: hashedPassword,
		}).save()
		
		return {
			executed: true,
			status: true,
			message: 'Successfully created account',
			created: true,
			user: user,
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
	if (!mongoose.isValidObjectId(_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid user _id'
		}
	}

	try {
		const user = await UserModel.findOneAndUpdate(
			{ _id },
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


const c_verifiedStatus = async (_id) => {
	if (!mongoose.isValidObjectId(_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid user _id'
		}
	}

	try {
		const user = await UserModel.findOne({
			_id,
			verified: true,
		})

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


// [EXPORT] //
module.exports = {
	c_readAll,
	c_read,
	c_update,
	c_getIdByEmail,
	c_updatePassword,
	c_login,
	c_register,
	c_verify,
	c_verifiedStatus,
}