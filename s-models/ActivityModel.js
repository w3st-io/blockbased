// [REQUIRE] //
const mongoose = require('mongoose')


// [EXPORT] //
module.exports = mongoose.model(
	'Activity',
	mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,

		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},

		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
		},

		type: {
			type: String,
			required: true,
			enum: ['user', 'comment', 'post'],
		},

		created_user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},

		created_post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
		},

		created_comment: {
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