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
			enum: ['user', 'comment', 'post', 'reply'],
		},

		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},

		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
		},

		comment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment',
		},

		createdAt: {
			type: Date,
			default: Date.now,
			maxlength: 50
		},
	})
)