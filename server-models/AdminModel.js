// [REQUIRE] //
const mongoose = require("mongoose")


// [SCHEMA MODEL] //
const AdminSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	role: {
		type: String,
		default: 'admin',
	},

	email: {
		type: String,
		required: true,
	},
	
	username: {
		type: String,
		required: true,
	},
	
	first_name: {
		type: String,
		required: true,
	},
	
	last_name: {
		type: String,
		required: true,
	},
	
	password: {
		type: String,
		required: true,
	},
	
	createdAt: {
		type: Date,
		default: Date.now
	}
})


// [EXPORTS] //
module.exports = mongoose.model('Admin', AdminSchema)