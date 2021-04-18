// [REQUIRE] //
const mongoose = require('mongoose')


module.exports = mongoose.model(
	'ProductOption',
	mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,
		
		cat: {
			type: String,
			required: false,
			default: '',
			maxlength: 100,
		},

		type: {
			type: String,
			required: false,
			default: '',
			maxlength: 100,
		},

		name: {
			type: String,
			required: true,
			maxlength: 100,
		},

		description: {
			type: String,
			required: false,
			maxlength: 500,
			default: '',
		},

		image: {
			type: String,
			required: false,
			maxlength: 500,
			default: '',
		},

		cost: {
			type: Number,
			required: false,
			maxlength: 10,
			default: 0.00,
		},
	})
)