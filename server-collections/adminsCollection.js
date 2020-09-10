/**
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
require('dotenv').config()


// [REQUIRE] Personal //
const AdminModel = require('../server-models/AdminModel')


// [INIT] //
const secretKey = process.env.SECRET_KEY || 'secret'


/******************* [LOGIN/REGISTER] *******************/
const c_login = async (email, password) => {
	try {
		// [VALIDATE-EMAIL] //
		const userFound = await AdminModel.findOne({ email: email })
		
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
		let token = jwt.sign(payload, secretKey, {/* expiresIn: 7200 */})

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
const c_register = async (req) => {
	try {
		// Username Check //
		const usernameFound = await AdminModel.findOne({ username: req.body.username })

		if (usernameFound) {
			return {
				executed: true,
				status: false,
				message: 'This username is taken',
				created: false,
			}
		}
	
		// Email Check //
		const emailFound = await AdminModel.findOne({ email: req.body.email })

		if (emailFound) {
			return {
				executed: true,
				status: false,
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

		// Hash Data //
		const hashedPassword = await bcrypt.hash(req.body.password, 10)

		// [SAVE] //
		const user = await new AdminModel({
			_id: mongoose.Types.ObjectId(),
			role: 'not-admin',
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