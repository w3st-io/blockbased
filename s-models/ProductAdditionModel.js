// [REQUIRE] //
const mongoose = require('mongoose')



const productAddition = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	cat: {
		type: String,
		maxlength: 50,
		default: '',
	},

	subCat: {
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
		description: '',
	},

	image: {
		type: String,
		maxlength: 500,
		default: '',
	},

	productVariants: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'ProductVariant',
			required: true,
		}
	],

	productExtras: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'ProductExtra',
			required: true,
		}
	],

	cost: {
		type: Number,
		maxlength: 6,
		default: 0.00,
	},

	created_at: {
		type: Date,
		default: Date.now,
		maxlength: 50
	},
})


productAddition.pre('validate', function (next) {
	// [LENGTH-CHECK] Blocks //
	if (this.productVariants.length > 20) { throw ('Error: too many variants') }

	if (this.productExtras.length > 20) { throw ('Error: too many extras') }
	
	next()
})
	
	
productAddition.pre('updateOne', function (next) {
	// [LENGTH-CHECK] Blocks //
	if (this._update.$set.productVariants.length > 500) {
		throw ('Error: too many variants')
	}

	if (this._update.$set.productExtras.length > 500) {
		throw ('Error: too many extras')
	}
	
	next()
})


module.exports = mongoose.model('ProductAddition', productAddition)