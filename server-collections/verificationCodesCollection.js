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
			status: true,
			createdVerificationCode: createdVerificationCode,
		}
	}
	catch (e) {
		return {
			status: false,
			message: `verificationCodesCollection: Caught Error --> ${e}`,
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
			status: true,
			deletedVerificationCode: deletedVerificationCode,
		}
	}
	catch (e) {
		return {
			status: false,
			message: `verificationCodesCollection: Caught Error --> ${e}`,
		}
	}
}


// [EXPORT] //
module.exports = {
	c_create,
	c_delete,
}
