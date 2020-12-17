// [REQUIRE] //
const mongoose = require('mongoose')


// [EXPORT] //
module.exports = mongoose.model(
	'PreeditedComment',
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
			required: true,
		},

		comment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment',
			required: true,
		},

		text: {
			type: String,
			required: true,
			maxlength: 6000,
		},

		likeCount: {
			type: Number,
			default: 0
		},
		
		liked: {
			type: Boolean,
			default: null
		},

		created_at: {
			type: Date,
			default: Date.now,
			maxlength: 50
		},
	})
)