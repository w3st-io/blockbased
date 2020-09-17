// [REQUIRE] //
const mongoose = require('mongoose')
const uuid = require('uuid')


// [SCHEMA MODEL] //
const verificationCodeSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	verificationCode: {
		type: String,
		required: [true, "This is required"],
		default: uuid.v4()
	},
})


// [EXPORTS] //
module.exports = mongoose.model('VerificationCode', verificationCodeSchema)