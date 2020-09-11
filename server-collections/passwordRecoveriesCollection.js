/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% PASSWORD RECOVERIES COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const PasswordRecoveryModel = require('../server-models/PasswordRecoveryModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id) => {
	// [VALIDATE] user_id //
	if (!mongoose.isValidObjectId(user_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid user_id',
		}
	}

	// [EXISTANCE] //
	const existance = await c_existance(user_id)

	if (!existance.status || existance.existance) { return existance }

	try {
		// [SAVE] //
		const passwordRecovery = await new PasswordRecoveryModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
		}).save()

		return {
			executed: true,
			status: true,
			passwordRecovery: passwordRecovery,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `passwordRecoveriesCollection: Error --> ${err}`,
		}
	}
	
}


// [DELETE] //
const c_delete = async (user_id) => {
	// [VALIDATE] user_id //
	if (!mongoose.isValidObjectId(user_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid user_id',
		}
	}

	try {
		const passwordRecovery = await PasswordRecoveryModel.deleteMany(
			{ user: user_id }
		)

		return {
			executed: true,
			status: true,
			passwordRecovery: passwordRecovery,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `passwordRecoveriesCollection: Error --> ${err}`,
		}
	}
}


/******************* [EXISTANCE] *******************/
// [EXISTANCE] //
const c_existance = async (user_id) => {
	if (!mongoose.isValidObjectId(user_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid user_id',
		}
	}

	try {
		const returned = await PasswordRecoveryModel.findOne({ user: user_id })

		if (!returned) {
			return {
				executed: true,
				status: true,
				message: 'Password recovery does NOT exists',
				existance: false,
			}
		}

		return {
			executed: true,
			status: true,
			message: 'Password recovery exists',
			existance: true,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `passwordRecoveriesCollection: Error --> ${err}`,
		}
	}
}


// [EXPORT] //
module.exports = {
	c_create,
	c_delete,
	c_existance,
}