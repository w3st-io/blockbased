// [REQUIRE] //
const mongoose = require('mongoose')


const product = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	
	cat: {
		type: String,
		maxlength: 50,
		required: true,
	},

	subCat: {
		type: String,
		maxlength: 50,
		required: true,
	},

	name: {
		type: String,
		maxlength: 100,
		required: true,
	},

	description: {
		type: String,
		maxlength: 500,
		required: false,
		description: '',
	},

	link: {
		type: String,
		maxlength: 500,
		required: false,
		default: '',
	},

	image: {
		type: String,
		maxlength: 500,
		required: false,
		default: '',
	},

	cost: {
		type: Number,
		maxlength: 6,
		required: true,
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

	totalProductAdditions: {
		type: Number,
		require: false,
		default: 1,
	},

	productAdditions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'ProductAddition',
			required: true,
		}
	],

	created_at: {
		type: Date,
		default: Date.now,
		maxlength: 50
	},
})


product.pre('validate', function (next) {
	// [LENGTH-CHECK] Blocks //
	if (this.productVariants.length > 20) { throw ('Error: too many variants') }

	if (this.productExtras.length > 20) { throw ('Error: too many extras') }
	
	if (this.productAdditions.length > 20) { throw ('Error: too many additions') }
	
	next()
})


product.pre('updateOne', function (next) {
	// [LENGTH-CHECK] Blocks //
	if (this._update.$set.productVariants.length > 20) {
		throw ('Error: too many variants')
	}

	if (this._update.$set.productExtras.length > 20) {
		throw ('Error: too many extras')
	}

	if (this._update.$set.productAddition.length > 20) {
		throw ('Error: too many additions')
	}
	
	next()
})


module.exports = mongoose.model('Product', product)