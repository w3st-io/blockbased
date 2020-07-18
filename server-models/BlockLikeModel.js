// [REQUIRE] //
const mongoose = require("mongoose")


// [SCHEMA MODEL] //
const BlockLikeSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	
	block: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Block'
	},

	createdAt: {
		type: Date,
		default: Date.now
	},
})


// [EXPORTS] //
module.exports = mongoose.model('BlockLike', BlockLikeSchema)