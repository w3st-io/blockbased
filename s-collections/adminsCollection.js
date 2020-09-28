/**
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const validator = require('validator')
require('dotenv').config()


// [REQUIRE] Personal //
const AdminModel = require('../s-models/AdminModel')


// [INIT] //
const secretKey = process.env.SECRET_KEY || 'secret'


/******************* [LOGIN/REGISTER] *******************/
const c_login = async (email, password) => {
	try {
		// [VALIDATE] email //
		if (!validator.isEmail(email)) {
			return {
				executed: true,
				status: false,
				message: 'adminsCollection: Invalid email'
			}
		}
		else { email = validator.normalizeEmail(email) }

		
		// [VALIDATE] password //
		if (!validator.isAscii(password)) {
			return {
				executed: true,
				status: false,
				message: 'adminsCollection: Invalid password (must be ASCII)'
			}
		}

		// [VALIDATE-EMAIL] //
		const userFound = await AdminModel.findOne({ email })
		
		if (!userFound) {
			return {
				executed: true,
				status: false,
				message: 'Account does not exist',
				validation: false,
			}
		}

		// [VALIDATE-PASSWORD] //
		if (!bcrypt.compareSync(password, userFound.password)) {
			return {
				executed: true,
				status: false,
				message: 'Invalid password',
				validation: false,
			}
		}

		// Set Payload //
		const payload = {
			admin_id: userFound._id,
			role: userFound.role,
			email: userFound.email,
			username: userFound.username,
			first_name: userFound.first_name,
			last_name: userFound.last_name,
		}

		// Set Token //
		const token = jwt.sign(payload, secretKey, {/* expiresIn: 7200 */})

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
			message: `adminsCollection: Error --> ${err}`,
			validation: false,
		}
	}
}


// [REGISTER] //
const c_register = async (username, email, password) => {
	try {
		// [VALIDATE] username //
		if (!validator.isAscii(username)) {
			return {
				executed: true,
				status: false,
				message: 'adminsCollection: Invalid username (must be ASCII)'
			}
		}

		// [VALIDATE] email //
		if (!validator.isEmail(email)) {
			return {
				executed: true,
				status: false,
				message: 'adminsCollection: Invalid email'
			}
		}
		else { email = validator.normalizeEmail(email) }

		// [VALIDATE] password //
		if (!validator.isAscii(password)) {
			return {
				executed: true,
				status: false,
				message: 'adminsCollection: Invalid password (must be ASCII)'
			}
		}

		// Username Check //
		if (await AdminModel.findOne({ username })) {
			return {
				executed: true,
				status: false,
				message: 'This username is taken',
				created: false,
			}
		}
	
		// Email Check //
		if (await AdminModel.findOne({ email })) {
			return {
				executed: true,
				status: false,
				message: 'This email is already registered',
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

		// Hash Password //
		const hashedPassword = await bcrypt.hash(password, 10)

		// [SAVE] //
		const user = await new AdminModel({
			_id: mongoose.Types.ObjectId(),
			role: 'not-admin',
			username: username,
			email: email,
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
			message: `adminsCollection: Error --> ${err}`,
			created: false,
		}
	}
}


// [EXPORT] //
module.exports = {
	c_login,
	c_register,
}