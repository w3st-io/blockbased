// [REQUIRE] //
const mongoose = require('mongoose')


// [SCHEMA MODEL] //
const AdminSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	role: {
		type: String,
		default: 'not-admin',
		maxlength: 10,
	},

	email: {
		type: String,
		required: [true, "This is required"],
		maxlength: 50,
		lowercase: true
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
module.exports = mongoose.model('Admin', AdminSchema)