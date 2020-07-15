// [REQUIRE] //
const mongoose = require("mongoose")


// [SCHEMA MODEL] //
const BlockScema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},

	cat_id: { type: String },

	title: { type: String },

	likers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],

	followers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],

	createdAt: {
		type: Date,
		default: Date.now
	},
})


// [EXPORTS] //
module.exports = mongoose.model('Block', BlockScema)