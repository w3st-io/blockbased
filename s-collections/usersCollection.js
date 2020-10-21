/**
 * %%%%%%%%%%%%%%%%%%%%%%%%
 * %%% USERS COLLECTION %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const config = require('../s-config')
const UserModel = require('../s-models/UserModel')


// [INIT] //
const secretKey = config.SECRET_KEY


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
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'UserCollection: Invalid user_id'
			}
		}
	
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


// [UPDATE] Profile Picture //
const c_update = async (user_id, img_url) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'UserCollection: Invalid user_id'
			}
		}

		// [VALIDATE] img_url //
		if (!validator.isURL(img_url)) {
			return {
				executed: true,
				status: false,
				message: 'UserCollection: Invalid img_url'
			}
		}

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


/******************* [OTHER-CRUD] *******************/
const c_getIdByEmail = async (email) => {
	try {
		// [VALIDATE] Email //
		if (!validator.isEmail(email)) {
			return {
				executed: true,
				status: false,
				message: 'UserCollection: Invalid email'
			}
		}

		const user = await UserModel.findOne({ email })

		if (!user) {
			return {
				executed: true,
				status: false,
				message: 'UserCollection: No user found'
			}
		}

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


const c_updatePassword = async (user_id, password) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'UserCollection: Invalid user_id'
			}
		}
		
		// [VALIDATE] password //
		if (!validator.isAscii(password)) {
			return {
				executed: true,
				status: false,
				message: 'UserCollection: Invalid password'
			}
		}

		// Password Length //
		if (password.length < 8 || password.length > 50) {
			return {
				executed: true,
				status: false,
				message: 'Invalid password (8 < password < 50)',
			}
		}
	
		// Hash Password //
		const hashedPassword = await bcrypt.hash(password, 10)
		
		// [UPDATE] Password for User //
		const user = await UserModel.findOneAndUpdate(
			{ _id: user_id },
			{ $set: { password: hashedPassword } }
		)

		return {
			executed: true,
			status: true,
			message: 'UserCollection: Updated profile',
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
	try {
		// [VALIDATE] email //
		if (!validator.isEmail(email)) {
			return {
				executed: true,
				status: false,
				message: 'UserCollection: Invalid email'
			}
		}
		
		// [VALIDATE] password //
		if (!validator.isAscii(password)) {
			return {
				executed: true,
				status: false,
				message: 'UserCollection: Invalid password'
			}
		}

		// [VALIDATE-EMAIL] //
		const userFound = await UserModel.findOne({ email })

		if (!userFound) {
			return {
				executed: true,
				status: true,
				message: 'Invalid email or password',
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
			user_id: userFound._id,
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
	try {
		// [VALIDATE] //
		if (!validator.isAscii(username)) {
			return {
				executed: true,
				status: false,
				message: 'UserCollection: Invalid username'
			}
		}

		// [VALIDATE] email //
		if (!validator.isEmail(email)) {
			return {
				executed: true,
				status: false,
				message: 'UserCollection: Invalid email'
			}
		}

		// [VALIDATE] //
		if (!validator.isAscii(password)) {
			return {
				executed: true,
				status: false,
				message: 'UserCollection: Invalid password'
			}
		}

		// Username Check //
		if (await UserModel.findOne({ username })) {
			return {
				executed: true,
				status: true,
				message: 'That username is taken',
				created: false,
			}
		}

		// Email Check //
		if (await UserModel.findOne({ email })) {
			return {
				executed: true,
				status: true,
				message: 'That email is already registered',
				created: false,
			}
		}

		// Password Length //
		if (password.length < 8 || password.length > 50) {
			return {
				executed: true,
				status: false,
				message: 'UserCollection: Invalid password',
				created: false,
			}
		}

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
const c_verify = async (user_id) => {
	try {
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'UserCollection: Invalid user_id'
			}
		}

		const user = await UserModel.findOneAndUpdate(
			{ _id: user_id },
			{ $set: { verified: true } }
		)

		return {
			executed: true,
			status: true,
			message: 'UserCollection: Verified profile',
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


const c_verifiedStatus = async (user_id) => {
	try {
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'UserCollection: Invalid user_id'
			}
		}

		const user = await UserModel.findOne({
			_id: user_id,
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