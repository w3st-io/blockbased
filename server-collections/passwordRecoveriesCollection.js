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
	const existance = await c_existance(user_id)

	if (existance.status && !existance.existance) {
		const formData = new PasswordRecoveryModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
		})
		
		try {
			const passwordRecovery = await formData.save()

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
	else { return existance }
}


// [DELETE] //
const c_delete = async (user_id) => {
	try {
		const passwordRecovery = await PasswordRecoveryModel.deleteMany({ user: user_id })

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
	if (mongoose.isValidObjectId(user_id)) {
		try {
			const returned = await PasswordRecoveryModel.findOne({ user: user_id })

			if (returned) {
				return {
					executed: true,
					status: true,
					existance: true,
				}
			}
			else {
				return {
					executed: true,
					status: true,
					existance: false,
				}
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
	else {
		return {
			executed: true,
			status: false,
			message: 'Invalid user_id',
		}
	}
}


// [EXPORT] //
module.exports = {
	c_create,
	c_delete,
	c_existance,
}