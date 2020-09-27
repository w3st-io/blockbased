/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% VERIFICATION CODES COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const VerificationCodeModel = require('../s-models/VerificationCodeModel')


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
		const verificationCode = await new VerificationCodeModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
		}).save()

		return {
			executed: true,
			status: true,
			verificationCode: verificationCode,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `verificationCodesCollection: Error --> ${err}`,
		}
	}
}

// [DELETE] //
const c_delete = async (user_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'Invalid user_id',
			}
		}
	
		const verificationCode = await VerificationCodeModel.deleteMany({
			user: user_id
		})

		return {
			executed: true,
			status: true,
			verificationCode: verificationCode,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `verificationCodesCollection: Error --> ${err}`,
		}
	}
}


/******************* [EXISTANCE] *******************/
// [EXISTANCE] //
const c_existance = async (user_id, verificationCode) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'Invalid user_id',
			}
		}

		// [VALIDATE] verificationCode //
		if (!validator.isAscii(verificationCode)) {
			return {
				executed: true,
				status: false,
				message: 'Invalid verificationCode',
			}
		}

		const vCode = await VerificationCodeModel.findOne({
			user: user_id,
			verificationCode
		})

		if (vCode) {
			return {
				executed: true,
				status: true,
				message: 'Success! Verified Account',
				existance: true,
				verificationCode: vCode,
			}
		}
		else {
			return {
				executed: true,
				status: true,
				message: 'Invalid verification code',
				existance: false,
			}
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `verificationCodesCollection: Error --> ${err}`,
		}
	}
}


// [EXPORT] //
module.exports = {
	c_create,
	c_delete,
	c_existance,
}
