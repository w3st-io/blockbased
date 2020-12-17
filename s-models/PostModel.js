// [REQUIRE] //
const mongoose = require('mongoose')


// [EXPORT] //
module.exports = mongoose.model(
	'Post',
	mongoose.Schema({
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
	
		likeCount: {
			type: Number,
			default: 0,
		},
	
		liked: {
			type: Boolean,
			default: null,
		},
	
		followsCount: {
			type: Number,
			default: 0,
		},
	
		followed: {
			type: Boolean,
			default: null,
		},
	
		commentCount: {
			type: Number,
			default: 0,
		},
	
		pinned: {
			type: Boolean,
			default: false,
		},
	
		created_at: {
			type: Date,
			default: Date.now,
			maxlength: 50
		},
	})
)