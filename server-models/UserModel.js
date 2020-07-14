// [REQUIRE] //
const mongoose = require("mongoose")


// [SCHEMA MODEL] //
const UserSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	first_name: { type: String },

	last_name: { type: String },

	username: { type: String },

	email: { type: String },

	password: { type: String },

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