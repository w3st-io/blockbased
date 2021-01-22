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

	cleanJSON: {
		time: {
			type: Number,
			maxlength: 100,
		},

		blocks: [{
			type: {
				type: String,
				enum: ['code', 'delimiter', 'header', 'image', 'list', 'paragraph', 'quote', 'table'],
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

				content: [
					[{
						type: String,
						maxlength: 50,
					}]
				],

				items: [{
					type: String,
					maxlength: 50,
				}],

				level: {
					type: Number,
					enum: [1, 2, 3, 4, 5, 6],
				},

				style: {
					type: String,
					enum: ['ordered', 'unordered']
				},

				text: {
					type: String,
					maxlength: 3000,
				},

				url: {
					type: String,
					maxlength: 300,
				},
			},
		}],
		version: {
			type: String,
			maxlength: 15
		}
	},

	replyToComment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment',
		required: false,
	},

	likeCount: {
		type: Number,
		default: 0
	},
	
	liked: {
		type: Boolean,
		default: null
	},

	created_at: {
		type: Date,
		default: Date.now,
		maxlength: 50
	},
})


comment.pre('validate', function(next) {
	// [LENGTH-CHECK] Blocks //
	if (this.cleanJSON.blocks.length > 20) { throw ('Error: Comment too large') }

	this.cleanJSON.blocks.forEach(block => {
		// [LENGTH-CHECK] List Items //
		if (block.data.items) {
			if (block.data.items.length > 20) {
				throw ('Error: Too many list-items')
			}
		}
		
		// [LENGTH-CHECK] Table ROW //
		if (block.data.content) {
			if (block.data.content.length > 20) {
				throw ('Error: Too many Rows')
			}
		}

		// [LENGTH-CHECK] Table COLUMN //
		if (block.data.content) {
			block.data.content.forEach(col => {
				if (col.length > 20) {
					throw ('Error: Too many Columns')
				}
			})
		}
	})
	
	next()
})


comment.pre('updateOne', function(next) {
	// [LENGTH-CHECK] Blocks //
	if (this._update.$set.cleanJSON.blocks.ledngth > 20) {
		throw ('Error: Comment too large')
	}

	this._update.$set.cleanJSON.blocks.forEach(block => {
		// [LENGTH-CHECK] List Items //
		if (block.data.items) {
			if (block.data.items.length > 20) {
				throw ('Error: Too many list-items')
			}
		}

		// [LENGTH-CHECK] Table ROW //
		if (block.data.content) {
			if (block.data.content.length > 20) {
				throw ('Error: Too many Rows')
			}
		}

		// [LENGTH-CHECK] Table COLUMN //
		if (block.data.content) {
			block.data.content.forEach(col => {
				if (col.length > 20) {
					throw ('Error: Too many Columns')
				}
			})
		}
	})
	
	next()
})


// [EXPORT] //
module.exports = mongoose.model('Comment', comment)