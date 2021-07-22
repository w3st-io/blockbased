// [REQUIRE] //
const mongoose = require('mongoose')


// [VALIDATOR] //
function validate({ ban }) {
	return { status: true }
}


const ban = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	
	bannedTill: {
		type: Date,
		required: true,
	},

	created_at: {
		type: Date,
		default: Date.now,
		maxlength: 50
	},
})


ban.pre('validate', function (next) {
	const status = validate({ ban: this })

	if (status.status == false) { throw status.message }
	
	next()
})


ban.pre('updateOne', function (next) {
	const status = validate({ ban: this._update.$set })

	if (status.status == false) { throw status.message }
	
	next()
})


module.exports = mongoose.model('Ban', ban)