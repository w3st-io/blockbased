// [REQUIRE] //
const mongoose = require('mongoose')


// [EXPORT] //
module.exports = mongoose.model(
	'CommentReport',
	mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,

		handled: {
			type: Boolean,
			default: false,
		},

		reportType: {
			type: String,
			required: true,
			enum: ['innapropiate', 'offensive', 'scam', 'bot', 'other'],
			maxlength: 24,
		},
		
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
			required: true,
		},
		
		comment: {
			type: Object,
			required: true,
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