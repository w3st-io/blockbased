// [REQUIRE] //
const mongoose = require('mongoose')


// [SCHEMA MODEL] //
const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	email: {
		type: String,
		required: [true, "This is required"],
		maxlength: 50,
	},

	username: {
		type: String,
		required: [true, "This is required"],
		maxlength: 24,
	},
	
	first_name: {
		type: String,
		required: false,
		default: '',
		maxlength: 24,
	},
	
	last_name: {
		type: String,
		required: false,
		default: '',
		maxlength: 24,
	},
	
	profileImg: {
		type: String,
		default: 'https://icon-library.com/images/placeholder-icon/placeholder-icon-17.jpg',
		maxlength: 600,
	},
	
	password: {
		type: String,
		required: [true, "This is required"],
	},

	verified: {
		type: Boolean,
		default: false,
	},

	createdAt: {
		type: Date,
		default: Date.now,
		maxlength: 50
	}
})


// [EXPORTS] //
module.exports = mongoose.model('User', userSchema)