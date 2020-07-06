// [REQUIRE] //
const mongoose = require("mongoose")
require('mongoose-type-email')


// [SCEMA] //
const Schema = mongoose.Schema


// [SCHEMA MODEL] //
const UserSchema = new Schema({
	first_name: {
		type: String
	},
	last_name: {
		type: String
	},
	username: {
		type: String
	},
	email: {
		type: String
	},
	password: {
		type: String
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
})

// [EXPORTS] //
module.exports = User = mongoose.model('users', UserSchema)