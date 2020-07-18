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
	},

	title: {
		type: String,
		required: true,
	},

	likers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	],

	followers: [
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
module.exports = mongoose.model('Block', BlockSchema)