// [REQUIRE] //
const mongoose = require("mongoose")


// [SCHEMA MODEL] //
const CommentSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	block_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Block',
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
	},

	likers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	],

	createdAt: {
		type: Date,
		default: Date.now
	},
})


// [EXPORTS] //
module.exports = mongoose.model('Comment', CommentSchema)