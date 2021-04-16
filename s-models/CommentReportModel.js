// [REQUIRE] //
const mongoose = require('mongoose')


module.exports = mongoose.model(
	'CommentReport',
	mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,

		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},

		handled: {
			type: Boolean,
			default: false,
		},

		reportType: {
			type: String,
			required: true,
			enum: ['innapropiate', 'offensive', 'scam', 'bot', 'spam', 'other'],
			maxlength: 14,
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
		
		reportedUser: {
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