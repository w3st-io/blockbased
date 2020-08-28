// [REQUIRE] //
const mongoose = require('mongoose')


// [SCHEMA MODEL] //
const VerificationCodeSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	verificationCode: {
		type: String,
		required: [true, "This is required"],
	},
})


// [EXPORTS] //
module.exports = mongoose.model('VerificationCode', VerificationCodeSchema)