// [REQUIRE] //
const mongoose = require('mongoose')


// [SCHEMA MODEL] //
const commentSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post',
		required: true,
	},

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	text: {
		type: String,
		required: true,
		maxlength: 6000,
	},

	likeCount: { type: Number, default: 0 },
	
	liked: { type: Boolean, default: null },

	createdAt: {
		type: Date,
		default: Date.now,
		maxlength: 50
	},
})


// [EXPORTS] //
module.exports = mongoose.model('Comment', commentSchema)