/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% VERIFICATION CODES COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')
const uuid = require('uuid')


// [REQUIRE] Personal //
const VerificationCodeModel = require('../server-models/VerificationCodeModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id) => {
	const formData = new VerificationCodeModel(
		{
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			verificationCode: uuid.v4()
		}
	)

	try {
		const createdVerificationCode = await formData.save()

		return {
			executed: true,
			status: true,
			createdVerificationCode: createdVerificationCode,
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
		const deletedVerificationCode = await VerificationCodeModel.deleteMany(
			{ user: user_id }
		)

		return {
			executed: true,
			status: true,
			deletedVerificationCode: deletedVerificationCode,
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
	if (mongoose.isValidObjectId(user_id)) {
		try {
			const foundVerificationCode = await VerificationCodeModel.findOne({
				user: user_id,
				verificationCode: verificationCode
			})

			if (foundVerificationCode) {
				return {
					executed: true,
					status: true,
					message: 'Success! Verified Account',
					existance: true,
					foundVerificationCode: foundVerificationCode,
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
	else {
		return {
			executed: true,
			status: false,
			message: 'Invalid user _id',
		}
	}
}


// [EXPORT] //
module.exports = {
	c_create,
	c_delete,
	c_existance,
}
