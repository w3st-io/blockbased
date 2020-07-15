// [REQUIRE] //
const mongoose = require("mongoose")


// [SCHEMA MODEL] //
const CommentReportScema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	block_id: mongoose.Schema.Types.ObjectId,

	reportType: { type: String },
	
	comment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment'
	},

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},

	createdAt: {
		type: Date,
		default: Date.now
	},
})


// [EXPORTS] //
module.exports = mongoose.model('CommentReport', CommentReportScema)