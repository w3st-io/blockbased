// [REQUIRE] //
const mongoose = require("mongoose")


// [SCHEMA MODEL] //
const CommentScema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	block_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Block' 
	},

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},

	comment: { type: String },

	likers: [
		{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }
	],

	createdAt: {
		type: Date,
		default: Date.now
	},
})


// [EXPORTS] //
module.exports = mongoose.model('Comment', CommentScema)