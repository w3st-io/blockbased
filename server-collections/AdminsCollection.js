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


// [MONGOOSE CONNECT] //
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})


// [INIT] //
const secretKey = process.env.SECRET_KEY || 'secret'


class BlocksCollection {
	/******************* [LOGIN/REGISTER] *******************/
	static async login(req) {

		try {
			const accountFound = await AdminModel.findOne({ email: req.body.email })
			
			// [VALIDATE ACCOUNT] --> [VALIDATE PASSWORD] //
			if (accountFound) {
				if (bcrypt.compareSync(req.body.password, accountFound.password)) {
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
						token: token,
					}
				}
				else {
					return {
						status: false,
						message: 'incorrect_password'
					}
				}
			}
			else {
				return {
					status: false,
					message: 'incorrect_email'
				}
			}
		}
		catch(e) {
			return {
				status: false,
				message: `Caught Error --> ${e}`
			}
		}
	}


	// [REGISTER] //
	static async register(req) {
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
					// Hash Data //
					bcrypt.hash(formData.password, 10, (e, hash) => {
						if (e) { return { status: `Caught Error --> ${e}` } }

						formData.password = hash

						try { formData.save() }
						catch(e) {
							return {
								status: false,
								message: `Caught Error --> ${e}`
							}
						}
					})
					
					return {
						status: true,
						message: 'success'
					}
				}
				else {
					return {
						status: false,
						message: 'This email is already registered'
					}
				}
			}
			else {
				return {
					status: false,
					message: 'This email is taken'
				}
			}
		}
		catch(e) {
			return {
				status: false,
				message: `Caught Error --> ${e}`
			}
		}
	}
}


// [EXPORT] //
module.exports = BlocksCollection