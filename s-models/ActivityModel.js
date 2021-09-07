// [REQUIRE] //
const mongoose = require('mongoose')


// [VALIDATE] //
function validate({ activity }) {
	return { status: true }
}


const activity = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post',
	},

	type: {
		type: String,
		required: true,
		enum: ['comment', 'manager', 'post', 'user'],
	},

	createdUser: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},

	createdPost: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post',
	},

	createdComment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment',
	},

	createdAt: {
		type: Date,
		default: Date.now,
		maxlength: 50
	},
})


activity.pre('validate', function (next) {
	const status = validate({ activity: this })

	if (status.status == false) { throw status.message }
	
	next()
})


activity.pre('updateOne', function (next) {
	const status = validate({ activity: this._update.$set })

	if (status.status == false) { throw status.message }
	
	next()
})


module.exports = mongoose.model('Activity', activity)