// [REQUIRE] //
const mongoose = require('mongoose')


module.exports = mongoose.model(
	'StripeCustomer',
	mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,
		
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},

		stripe_customer_id: {
			type: String,
			required: true,
		},

		created_at: {
			type: Date,
			default: Date.now,
			maxlength: 50
		},
	})
)