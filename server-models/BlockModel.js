// [REQUIRE] //
const mongoose = require("mongoose")


// [SCHEMA MODEL] //
const BlockSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	cat_id: {
		type: String,
		required: true,
		maxlength: 30,
	},

	title: {
		type: String,
		required: true,
		maxlength: 200,
	},

	likeCount: { type: Number, default: null, },

	liked: { type: Boolean, default: null, },

	followers: [
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
module.exports = mongoose.model('Block', BlockSchema)