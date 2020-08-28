// [REQUIRE] //
const mongoose = require('mongoose')


// [SCHEMA MODEL] //
const PostSchema = mongoose.Schema({
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

	likeCount: { type: Number, default: 0, },

	liked: { type: Boolean, default: null, },

	followersCount: { type: Number, default: 0, },

	followed: { type: Boolean, default: null, },

	commentCount: { type: Number, default: 0, },

	createdAt: {
		type: Date,
		default: Date.now,
		maxlength: 50
	},
})


// [EXPORTS] //
module.exports = mongoose.model('Post', PostSchema)