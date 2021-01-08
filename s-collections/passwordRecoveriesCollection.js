// [REQUIRE] //
const mongoose = require('mongoose')
const uuid = require('uuid')


// [REQUIRE] Personal //
const PasswordRecoveryModel = require('../s-models/PasswordRecoveryModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'Invalid user_id',
			}
		}

		// [SAVE] //
		const passwordRecovery = await new PasswordRecoveryModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			verificationCode: uuid.v4()
		}).save()

		return {
			executed: true,
			status: true,
			message: 'Created passwordRecovery',
			passwordRecovery: passwordRecovery
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


/******************* [OTHER-CRUD] *******************/
// [DELETE] User //
const c_deleteByUser = async (user_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'Invalid user_id',
			}
		}

		await PasswordRecoveryModel.deleteMany({ user: user_id })

		return {
			executed: true,
			status: true,
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


// [DELETE] Custom //
const c_deleteCustom = async (filter) => {
	try {
		// [VALIDATE] filter //
		if (!filter || filter == {}) {
			return {
				executed: true,
				status: false,
				message: 'commentLikesCollection: No filter passed',
				updated: false,
			}
		}

		await PasswordRecoveryModel.deleteMany(filter)

		return {
			executed: true,
			status: true,
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
const c_existance = async (user_id) => {
	try {
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'Invalid user_id',
			}
		}

		if (!await PasswordRecoveryModel.findOne({ user: user_id })) {
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


/******************* [VALIDATION] *******************/
const c_validateToken = async (user_id, verificationCode) => {
	try {
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'Invalid user_id',
			}
		}

		// [VALIDATE] user_id //
		if (!verificationCode) {
			return {
				executed: true,
				status: false,
				message: 'No verificationCode passed',
			}
		}

		// [VALIDATE][EXISTANCE] //
		const existance = await c_existance(user_id)

		if (!existance.status || !existance.existance) { return existance }

		// [VALIDATE] //
		const passwordRecovery = await PasswordRecoveryModel.findOne({
			user: user_id,
			verificationCode: verificationCode
		})

		if (!passwordRecovery) {
			return {
				executed: true,
				status: true,
				message: 'Password Recovery verificationCode invalid',
				valid: false,
			}
		}

		return {
			executed: true,
			status: true,
			message: 'Password Recovery verificationCode valid',
			passwordRecovery: passwordRecovery,
			valid: true,
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
	c_deleteByUser,
	c_deleteCustom,
	c_existance,
	c_validateToken,
}