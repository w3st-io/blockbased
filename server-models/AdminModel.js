// [REQUIRE] //
const mongoose = require("mongoose")


// [SCHEMA MODEL] //
const AdminSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	role: {
		type: String,
		default: 'admin'
	},

	email: { type: String },
	
	username: { type: String },
	
	first_name: { type: String },
	
	last_name: { type: String },
	
	password: { type: String },
	
	createdAt: {
		type: Date,
		default: Date.now
	}
})


// [EXPORTS] //
module.exports = mongoose.model('Admin', AdminSchema)