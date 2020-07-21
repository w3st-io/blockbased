// [REQUIRE] //
const mongoose = require("mongoose")


// [SCHEMA MODEL] //
const UserSchema = mongoose.Schema({
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
		required: [true, "This is required"],
		maxlength: 24,
	},
	
	last_name: {
		type: String,
		required: [true, "This is required"],
		maxlength: 24,
	},
	
	profileImg: {
		type: String,
		default: '',
		maxlength: 600,
	},
	
	password: {
		type: String,
		required: [true, "This is required"],
	},

	createdAt: {
		type: Date,
		default: Date.now,
		maxlength: 50
	}
})

// [EXPORTS] //
module.exports = mongoose.model('User', UserSchema)