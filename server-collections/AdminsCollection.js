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
const c_login = async (req) => {
	try {
		const accountFound = await AdminModel.findOne({ email: req.body.email })
		
		// [VALIDATE ACCOUNT] --> [VALIDATE PASSWORD] //
		if (accountFound) {
			if (bcrypt.compareSync(req.body.password, accountFound.password)) {
				// Set Payload //
				const payload = {
					_id: accountFound._id,
					role: accountFound.role,
					email: accountFound.email,
					username: accountFound.username,
					first_name: accountFound.first_name,
					last_name: accountFound.last_name,
				}

				// Set Token //
				//let token = jwt.sign(payload, secretKey, { expiresIn: 7200 })
				const token = jwt.sign(payload, secretKey, {})

				return {
					status: true,
					message: 'success',
					validation: true,
					token: token,
				}
			}
			else {
				return {
					status: true,
					message: 'Invalid password',
					validation: false,
				}
			}
		}
		else {
			return {
				status: true,
				message: 'Invalid email',
				validation: false
			}
		}
	}
	catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
}


// [REGISTER] //
const c_register = async (req) => {
	let formData = new AdminModel({
		_id: mongoose.Types.ObjectId(),
		role: 'not-admin',
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
	})

	try {
		const usernameFound = await AdminModel.findOne(
			{ username: req.body.username }
		)
		const emailFound = await AdminModel.findOne({ email: req.body.email })

		if (!usernameFound) {
			if (!emailFound) {
				if (formData.password.length > 8 && formData.password.length < 50) {
					try {
						// Hash Data //
						formData.password = await bcrypt.hash(formData.password, 10)

						await formData.save()
						
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
						message: 'Password too short',
						created: false,
					}
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


// [EXPORT] //
module.exports = {
	c_login,
	c_register,
}