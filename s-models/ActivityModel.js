// [REQUIRE] //
const mongoose = require('mongoose')


// [EXPORT] //
module.exports = mongoose.model(
	'Activity',
	mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,
		
		type: {
			type: String,
			required: true,
			enum: ['account', 'comment', 'post', 'reply',],
		},

		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
		},

		comment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment',
			required: true,
		},

		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},

		createdAt: {
			type: Date,
			default: Date.now,
			maxlength: 50
		},
	})
)