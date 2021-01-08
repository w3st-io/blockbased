// [REQUIRE] //
const mongoose = require('mongoose')


// [EXPORT] //
module.exports = mongoose.model(
	'UserReport',
	mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,

		handled: {
			type: Boolean,
			default: false,
		},

		reportType: {
			type: String,
			required: true,
			enum: ['innapropiate', 'offensive', 'scammer', 'bot', 'other'],
			maxlength: 24,
		},
		
		
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},

		created_at: {
			type: Date,
			default: Date.now,
			maxlength: 50
		},
	})
)