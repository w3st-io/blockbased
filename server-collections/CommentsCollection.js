/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENTS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')
require('dotenv').config()


// [REQUIRE] //
const CommentModel = require('../server-models/CommentModel')


// [MONGOOSE CONNECT] //
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})


class CommentsCollection {
	/******************* [CRUD] *******************/
	// [CREATE] //
	static async create(req) {
		const user_id = req.decoded._id
		const block_id = req.body.block_id
		const text = req.body.text

		const formData = new CommentModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			block_id: block_id,
			text: text,
			likers: [],
		})

		try { await formData.save() }
		catch(e) {
			return {
				status: false,
				user: user_id,
				block: block_id,
				message: `Caught Error --> ${e}`,
			}
		}

		return {
			status: true,
			user: user_id,
			block: block_id,
			message: `Created comment in ${block_id}.`
		}
	}


	// [READ-ALL-ALL] //
	static async readAllAll(req) {
		const skip = parseInt(req.params.skip)
		const amount = parseInt(req.params.amount)
		
		try {
			const returnedData = await CommentModel.find()
				.skip(skip)
				.limit(amount)
				.populate(
					'user',
					'first_name last_name username email profileImg'
				)
				.populate('block_id')
				.exec()

			return returnedData
		}
		catch(e) {
			return {
				status: false,
				message: `Caught Error --> ${e}`,
			}
		}
	}
	


	// [READ-ALL] Within a Block //
	static async readAll(req) {
		const block_id = req.body.block_id
		const skip = parseInt(req.params.skip)
		const amount = parseInt(req.params.amount)

		try {
			const returnedData = await CommentModel.find(
				{ block: block_id }
			)
				.skip(skip)
				.limit(amount)
				.populate({
					path: 'user',
					select: 'first_name last_name username email profileImg'
				})
				.exec()

			return returnedData
		}
		catch(e) {
			return {
				status: false,
				message: `Caught Error --> ${e}`,
			}
		}
	}


	// [READ] //
	static async read(req) {
		const comment_id = req.params._id
		const validId = mongoose.isValidObjectId(comment_id)
	
		if (validId) {
			try {
				const returnedData = await CommentModel.findById(comment_id)
					.populate({
						path: 'user',
						select: 'first_name last_name username email profileImg'
					})
					.populate({
						path: 'likers',
						select: '_id user_id block_id text'
					})
					.exec()

				return returnedData
			}
			catch(e) {
				return {
					status: false,
					message: `Caught Error --> ${e}`,
				}
			}
		}
		else {
			return {
				status: false,
				message: 'Invalid Comment ID.',
			}
		}
	}


	// [UPDATE] //
	static async update(req) {
		const comment_id = req.params._id
		const text = req.body.text
		const validId = mongoose.isValidObjectId(comment_id)

		if (validId) {
			try {
				await CommentModel.updateOne(
					{ _id: comment_id },
					{ '$set': { 'text': text } },
				)
			}
			catch(e) {
				return {
					status: false,
					comment_id: comment_id,
					text: text,
					message: `Caught Error --> ${e}`,
				}
			}

			return {
				status: true,
				comment_id: comment_id,
				text: text,
				message: 'Updated comment.',
			}
		}
		else {
			return {
				status: false,
				comment_id: comment_id,
				text: text,
				message: 'Invalid Comment ID.',
			}
		}
	}


	// [DELETE] //
	static async delete(req) {
		const comment_id = req.params._id
		const user_id = req.decoded._id
		const validId = mongoose.isValidObjectId(comment_id)

		if (validId) {
			try {
				await CommentModel.findOneAndRemove(
					{
						_id: comment_id,
						user: user_id,
					}
				)		
			}
			catch(e) {
				return {
					status: false,
					user_id: user_id,
					comment_id: comment_id,
					message: `Caught Error --> ${e}`,
				}
			}

			return {
				status: true,
				user_id: user_id,
				comment_id: comment_id,
				message: 'Deleted comment.',
			}
		}
		else {
			return {
				status: false,
				user_id: user_id,
				comment_id: comment_id,
				message: 'Invalid Comment ID.',
			}
		}
	}


	/******************* [VOTE SYSTEM] *******************/
	// [LIKE] //
	static async like(req) {
		const validId = mongoose.isValidObjectId(req.params._id)

		if (validId) {
			try {
				await CommentModel.updateOne(
					{ _id: req.params._id },
					{ '$addToSet': { 
						'likers': req.decoded._id
					} }
				)
				
				return
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Comment ID.' }
	}


	// [UNLIKE] //
	static async unlike(req) {
		const validId = mongoose.isValidObjectId(req.params._id)

		if (validId) {
			try {
				await CommentModel.updateOne(
					{ _id: req.params._id },
					{ '$pull': { 
						'likers': req.decoded._id
					} }
				)

				return
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Comment ID.' }
	}


	// [LIKE-EXISTANCE] //
	static async LikeExistance(req) {
		try {	
			const returnedData = await CommentModel.findOne(
				{
					_id: req.params._id,
					likers: req.decoded._id
				}
			)

			if (returnedData) { return true }
			else { return false }
		}
		catch(e) { return `Caught Error: ${e}` }
	}

	
	/******************* [EXISTANCE + OWNERSHIP] *******************/
	// [EXISTANCE] //
	static async existance(comment_id) {
		if (mongoose.isValidObjectId(comment_id)) {
			try {	
				const returnedData = await CommentModel.findOne(
					{ _id: _id }
				)

				if (returnedData) { return true }
				else { return false }
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Comment ID.' }
	}


	// [OWNERSHIP] //
	static async ownership(req) {
		if (mongoose.isValidObjectId(req.params._id)) {
			try {	
				const returnedData = await CommentModel.findOne(
					{
						_id: req.params._id,
						user: req.decoded._id,
					}
				)

				if (returnedData) { return true }
				else { return false }
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Comment ID.' }
	}


	/******************* [COUNT] *******************/
	static async count(req) {
		try {
			const count = await CommentModel.countDocuments(
				{ cat_id: req.params.cat_id }
			)

			return count
		}
		catch(e) { return `Caught Error: ${e}` }
	}
}


// [EXPORT] //
module.exports = CommentsCollection