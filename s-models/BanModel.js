// [REQUIRE] //
const mongoose = require('mongoose')


// [EXPORT] //
module.exports = mongoose.model(
	'Ban',
	mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,
		
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		
		bannedTill: {
			type: Date,
			required: true,
		},
	
		created_at: {
			type: Date,
			default: Date.now,
			maxlength: 50
		},
	})
)