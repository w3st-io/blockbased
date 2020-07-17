// [REQUIRE] //
const mongoose = require("mongoose")


// [SCHEMA MODEL] //
const UserSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	first_name: {
		type: String,
		required: true,
	},

	last_name: {
		type: String,
		required: true,
	},
	
	username: {
		type: String,
		required: true,
	},
	
	email: {
		type: String,
		required: true,
	},
	
	password: {
		type: String,
		required: true,
	},

	profileImg: {
		type: String,
		default: '',
	},

	createdAt: {
		type: Date,
		default: Date.now
	}
})

// [EXPORTS] //
module.exports = mongoose.model('User', UserSchema)