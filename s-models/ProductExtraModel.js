// [REQUIRE] //
const mongoose = require('mongoose')


const productExtra = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	type: {
		type: String,
		maxlength: 50,
		default: '',
	},

	name: {
		type: String,
		maxlength: 100,
		required: true,
	},

	description: {
		type: String,
		maxlength: 500,
		default: '',
	},

	image: {
		type: String,
		maxlength: 500,
		default: '',
	},

	options: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'ProductOption',
			required: true,
		}
	],

	created_at: {
		type: Date,
		default: Date.now,
		maxlength: 50
	},
})


productExtra.pre('validate', function (next) {
	// [LENGTH-CHECK] Blocks //
	if (this.options.length > 20) { throw ('Error: Too many options') }
	
	next()
})


productExtra.pre('updateOne', function (next) {
	// [LENGTH-CHECK] Blocks //
	if (this._update.$set.options.length > 500) { throw ('Error: Too many options') }
	
	next()
})


module.exports = mongoose.model('ProductExtra', productExtra)