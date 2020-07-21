// [REQUIRE] //
const mongoose = require("mongoose")


// [SCHEMA MODEL] //
const BlockLikeSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
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
module.exports = mongoose.model('BlockLike', BlockLikeSchema)