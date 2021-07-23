// [REQUIRE] //
const mongoose = require('mongoose')


// [VALIDATOR] //
function validate({ product }) {
	// [LENGTH-CHECK] Blocks //
	if (product.productVariants.length > 20) {
		return {
			status: false,
			message: 'Error: too many variants'
		}
	}

	if (product.productExtras.length > 20) {
		return {
			status: false,
			message: 'Error: too many extras'
		}
	}
	
	if (product.productAdditions.length > 20) {
		return {
			status: false,
			message: 'Error: too many additions'
		}
	}

	return { status: true }
}


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
		description: '',
	},

	link: {
		type: String,
		maxlength: 500,
		default: '',
	},

	image: {
		type: String,
		maxlength: 500,
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
	const status = validate({ product: this })

	if (status.status == false) { throw status.message }

	next()
})


product.pre('updateOne', function (next) {
	const status = validate({ product: this._update.$set })

	if (status.status == false) { throw status.message }
	
	next()
})


module.exports = mongoose.model('Product', product)