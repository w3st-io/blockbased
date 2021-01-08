// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')
const uuid = require('uuid')


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
				message: 'VerificationCodesCollection: Invalid user_id',
			}
		}
	
		// [SAVE] //
		const verificationCode = await new VerificationCodeModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			verificationCode: uuid.v4(),
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


// [READ] //
const c_read = async (user_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'VerificationCodesCollection: Invalid user_id',
			}
		}

		const vCode = await VerificationCodeModel.findOne({ user: user_id })

		if (vCode) {
			return {
				executed: true,
				status: true,
				message: '',
				existance: true,
				verificationCode: vCode,
			}
		}
		
		return {
			executed: true,
			status: true,
			message: '',
			existance: false,
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


/******************* [OTHER-CRUD] *******************/
// [DELETE] user //
const c_deleteByUser = async (user_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'verificationCodesCollection: Invalid user_id',
			}
		}
	
		const vCode = await VerificationCodeModel.deleteMany({ user: user_id })

		return {
			executed: true,
			status: true,
			verificationCode: vCode,
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


/******************* [VALIDATE] *******************/
const c_validate = async (user_id, verificationCode) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'VerificationCodesCollection: Invalid user_id',
			}
		}

		// [VALIDATE] verificationCode //
		if (!validator.isAscii(verificationCode)) {
			return {
				executed: true,
				status: false,
				message: 'VerificationCodesCollection: Invalid verificationCode',
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
				message: 'Valid verification code',
				existance: true,
			}
		}

		return {
			executed: true,
			status: true,
			message: 'Invalid verification code',
			existance: false,
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
const c_existance = async (user_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'VerificationCodesCollection: Invalid user_id',
			}
		}

		const vCode = await VerificationCodeModel.findOne({ user: user_id })

		if (vCode) {
			return {
				executed: true,
				status: true,
				message: 'Valid verification code',
				existance: true,
			}
		}

		return {
			executed: true,
			status: true,
			message: 'Invalid verification code',
			existance: false,
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
	c_read,
	c_deleteByUser,
	c_validate,
	c_existance,
}
