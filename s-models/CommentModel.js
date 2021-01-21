// [REQUIRE] //
const mongoose = require('mongoose')


const comment = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	type: {
		type: String,
		enum: ['comment', 'reply'],
		default: 'comment'
	},

	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post',
		required: true,
	},

	replyToComment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment',
		required: false,
	},

	text: {
		type: String,
		required: true,
		maxlength: 6000,
	},

	cleanJsonText: {
		blocks: [{
			type: {
				type: String,
				enum: ['paragraph', 'code', 'delimiter', 'header', 'list', 'quote', 'table'],
			},
		
			data: {
				alignment: {
					type: String,
					enum: ['center', 'left']
				},

				caption: {
					type: String,
					maxlength: 1000,
				},

				code: {
					type: String,
					maxlength: 1000,
				},

				items: [{
					type: String,
					maxlength: 50,
				}],

				level: {
					type: Number,
					enum: [1, 2, 3, 4, 5, 6],
				},

				text: {
					type: String,
					maxlength: 3000,
				},
			},
		}],
	},

	likeCount: { type: Number, default: 0 },
	
	liked: { type: Boolean, default: null },

	created_at: {
		type: Date,
		default: Date.now,
		maxlength: 50
	},
})


comment.pre('validate', function(next) {
	if (this.cleanJsonText.blocks.length > 10) {
		throw ('Error: cleanJsonText.blocks.length > 10')
	}

	this.cleanJsonText.blocks.forEach(block => {
		if (block.data.items.length > 10) {
			throw ('Error: list items < 11')
		}
	});
	
	next()
})

// [EXPORT] //
module.exports = mongoose.model('Comment', comment)