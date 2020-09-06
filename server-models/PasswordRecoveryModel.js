// [REQUIRE] //
const mongoose = require('mongoose')
const uuid = require('uuid')


// [SCHEMA MODEL] //
const passwordRecoverySchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	verificationCode: {
		type: String,
		required: true,
		default: uuid.v4()
	},

	createdAt: {
		type: Date,
		default: Date.now,
		maxlength: 50
	},
})


// [EXPORT] //
module.exports = mongoose.model('PasswordRecovery', passwordRecoverySchema)