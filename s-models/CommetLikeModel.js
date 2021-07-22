// [REQUIRE] //
const mongoose = require('mongoose')


// [VALIDATOR] //
function validate({ commentLike }) {
	return { status: true }
}


const commentLike = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post',
		required: true,
	},

	comment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment',
		required: true,
	},

	commentUser: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	created_at: {
		type: Date,
		default: Date.now,
		maxlength: 50
	},
})


commentLike.pre('validate', function (next) {
	const status = validate({ commentLike: this })

	if (status.status == false) { throw status.message }
	
	next()
})


commentLike.pre('updateOne', function (next) {
	const status = validate({ commentLike: this._update.$set })

	if (status.status == false) { throw status.message }
	
	next()
})


module.exports = mongoose.model('CommentLike', commentLike)