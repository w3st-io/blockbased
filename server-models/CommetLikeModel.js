// [REQUIRE] //
const mongoose = require("mongoose")


// [SCHEMA MODEL] //
const CommentLikeSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	comment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment',
		required: true,
	},

	block: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Block',
		required: true,
	},

	createdAt: {
		type: Date,
		default: Date.now,
		maxlength: 50
	},
})


// [EXPORTS] //
module.exports = mongoose.model('CommentLike', CommentLikeSchema)