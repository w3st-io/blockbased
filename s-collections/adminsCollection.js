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
			message: 'Invalid password (must be ASCII)'
		}
	}

	try {
		// [VALIDATE-EMAIL] //
		const userFound = await AdminModel.findOne({ email })
		
		if (!userFound) {
			return {
				executed: true,
				status: false,
				message: 'Invalid email',
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
			_id: userFound._id,
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
const c_register = async (first_name, last_name, username, email, password) => {
	// [VALIDATE] first_name //
	if (!validator.isAlpha(first_name)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid first_name (must be alpha)'
		}
	}

	// [VALIDATE] last_name //
	if (!validator.isAlpha(last_name)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid last_name (must be alpha)'
		}
	}

	// [VALIDATE] username //
	if (!validator.isAscii(username)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid username (must be ASCII)'
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

	// [VALIDATE] password //
	if (!validator.isAscii(password)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid password (must be ASCII)'
		}
	}

	try {
		// Username Check //
		if (await AdminModel.findOne({ username })) {
			return {
				executed: true,
				status: false,
				message: 'This username is taken',
				created: false,
			}
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

	try {
		// Email Check //
		if (await AdminModel.findOne({ email })) {
			return {
				executed: true,
				status: false,
				message: 'This email is already registered',
				created: false,
			}
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
		const user = await new AdminModel({
			_id: mongoose.Types.ObjectId(),
			role: 'not-admin',
			first_name: first_name,
			last_name: last_name,
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