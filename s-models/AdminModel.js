// [REQUIRE] //
const mongoose = require('mongoose')
const mongooseFuzzySearching = require('mongoose-fuzzy-searching')


module.exports = mongoose.model(
	'Admin',
	mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,

		role: {
			type: String,
			enum: ['admin', 'not-admin'],
			default: 'not-admin',
			maxlength: 10,
		},

		email: {
			type: String,
			required: [true, 'This is required'],
			maxlength: 50,
			lowercase: true
		},
		
		username: {
			type: String,
			required: [true, 'This is required'],
			maxlength: 24,
		},
		
		first_name: {
			type: String,
			default: '',
			maxlength: 24,
		},
		
		last_name: {
			type: String,
			default: '',
			maxlength: 24,
		},
		
		password: {
			type: String,
			required: [true, 'This is required'],
		},
		
		created_at: {
			type: Date,
			default: Date.now,
			maxlength: 50
		},
	}).plugin(
		mongooseFuzzySearching,
		{
			fields: [
				{
					name: 'role',
					minSize: 4,
					weight: 5,
				},
				{
					name: 'email',
					minSize: 4,
					weight: 5,
				},
				{
					name: 'username',
					minSize: 4,
					weight: 5,
				},
				{
					name: 'first_name',
					minSize: 4,
					weight: 5,
				},
				{
					name: 'last_name',
					minSize: 4,
					weight: 5,
				},
			]
		}
	)
)