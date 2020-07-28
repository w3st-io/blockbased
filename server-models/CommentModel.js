// [REQUIRE] //
const mongoose = require("mongoose")


// [SCHEMA MODEL] //
const CommentSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	block: {
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
		maxlength: 6000,
	},

	likers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	],

	createdAt: {
		type: Date,
		default: Date.now,
		maxlength: 50
	},
})


// [EXPORTS] //
module.exports = mongoose.model('Comment', CommentSchema)