/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENTS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')
require('dotenv').config()


// [REQUIRE] //
const CommentModel = require('../models/CommentModel')


// [MONGOOSE CONNECT] //
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})


class CommentsCollection {
	/******************* [CRRUD] *******************/
	// [CREATE] //
	static async create(req) {
		const formData = new CommentModel({
			_id: mongoose.Types.ObjectId(),
			block_id: req.body.block_id,
			user: req.decoded._id,
			comment: req.body.comment,
			likers: [],
		})

		try { await formData.save() }
		catch(e) { return `Caught Error: ${e}` }

		return 'Created Comment.'
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
				.exec()

			return returnedData
		}
		catch(e) { return `Caught Error: ${e}` }
	}
	


	// [READ-ALL] Within a Block //
	static async readAll(req) {
		const skip = parseInt(req.params.skip)
		const amount = parseInt(req.params.amount)

		const returnedData = await CommentModel.find(
			{ block_id: req.params.block_id }
		)
			.skip(skip)
			.limit(amount)
			.populate({
				path: 'user',
				select: 'first_name last_name username email profileImg'
			})
			.populate({
				path: 'likers',
				select: 'first_name last_name username email profileImg'
			})
			.exec()

		return returnedData
	}


	// [READ] //
	static async read(req) {
		const validId = mongoose.isValidObjectId(req.params._id)
	
		if (validId) {
			try {
				const returnedData = await CommentModel.findById(req.params._id)
					.populate({
						path: 'user',
						select: 'first_name last_name username email profileImg'
					})
					.populate({
						path: 'likers',
						select: '_id'
					})
					.exec()

				return returnedData
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Comment ID.' }
	}


	// [UPDATE] //
	static async update(req) {
		const validId = mongoose.isValidObjectId(req.params._id)

		if (validId) {
			try {
				await CommentModel.updateOne(
					{ _id: req.params._id },
					{ '$set': { 'comment': req.body.comment } },
				)

				return
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Comment ID.' }
	}


	// [DELETE] //
	static async delete(req) {
		const validId = mongoose.isValidObjectId(req.params._id)

		if (validId) {
			try {
				await CommentModel.findOne({
					_id: req.params._id,
					user_id: req.decoded._id,
				})
				
				return
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Comment ID.' }
	}


	/******************* [VOTE SYSTEM] *******************/
	static async like(req) {
		const validId = mongoose.isValidObjectId(req.params._id)

		if (validId) {
			try {
				await CommentModel.updateOne(
					{ _id: req.params._id },
					{ '$addToSet': { 
						'likers': mongoose.Types.ObjectId(req.decoded._id)
					} }
				)
				
				return
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Comment ID.' }
	}


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