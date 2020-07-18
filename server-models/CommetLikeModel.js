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

	block_id: mongoose.Schema.Types.ObjectId,

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
		default: Date.now
	},
})


// [EXPORTS] //
module.exports = mongoose.model('CommentLike', CommentLikeSchema)