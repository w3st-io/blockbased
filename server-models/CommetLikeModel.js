// [REQUIRE] //
const mongoose = require("mongoose")


// [SCHEMA MODEL] //
const CommentLikeScema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},

	block_id: mongoose.Schema.Types.ObjectId,

	comment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment'
	},

	createdAt: {
		type: Date,
		default: Date.now
	},
})


// [EXPORTS] //
module.exports = mongoose.model('CommentLike', CommentLikeScema)