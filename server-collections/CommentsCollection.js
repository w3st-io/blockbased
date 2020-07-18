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
	static async create(user_id, block_id, text) {
		const formData = new CommentModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			block_id: block_id,
			text: text,
			likers: [],
		})

		try {
			await formData.save()

			return {
				status: true,
				message: `Created comment in ${block_id}.`,
				user: user_id,
				block: block_id,
			}
		}
		catch(e) {
			return {
				status: false,
				user: user_id,
				block: block_id,
				message: `Caught Error --> ${e}`,
			}
		}
	}


	// [READ-ALL-ALL] //
	static async readAllAll(skip, limit) {
		const skip2 = parseInt(skip)
		const limit2 = parseInt(limit)
		
		try {
			const returnedData = await CommentModel.find()
				.skip(skip2)
				.limit(limit2)
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
	static async readAll(block_id, skip, limit) {
		const skip2 = parseInt(skip)
		const limit2 = parseInt(limit)

		try {
			const returnedData = await CommentModel.find(
				{ block_id: block_id }
			)
				.skip(skip2)
				.limit(limit2)
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
	static async read(comment_id) {
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
	static async update(comment_id, text) {
		const validId = mongoose.isValidObjectId(comment_id)

		if (validId) {
			try {
				await CommentModel.updateOne(
					{ _id: comment_id },
					{ '$set': { 'text': text } },
				)

				return {
					status: true,
					comment_id: comment_id,
					text: text,
					message: 'Updated comment.',
				}
			}
			catch(e) {
				return {
					status: false,
					comment_id: comment_id,
					text: text,
					message: `Caught Error --> ${e}`,
				}
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
	static async delete(user_id, comment_id) {
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


	/******************* [LIKE SYSTEM] *******************/
	// [LIKE] //
	static async like(user_id, comment_id) {
		const validId = mongoose.isValidObjectId(comment_id)
		const existance = await this.LikeExistance(user_id, comment_id)

		if (existance.status == true) {
			if (existance.existance == false) {
				if (validId) {
					try {
						await CommentModel.updateOne(
							{ _id: comment_id },
							{ '$addToSet': { 
								'likers': user_id
							} }
						)
						
						return {
							status: true,
							message: 'Liked Comment',
							comment_id: comment_id,
							user_id: user_id,
						}
					}
					catch(e) {
						return { status: false, message: `Caught Error --> ${e}` }
					}
				}
				else { return { status: false, message: 'Invalid Comment ID.' } }
			}
			else { return { status: false, message: existance.message } }
		}
		else { return { status: false, message: existance.message } }
	}


	// [UNLIKE] //
	static async unlike(user_id, comment_id) {
		const validId = mongoose.isValidObjectId(comment_id)
		const existance = await this.LikeExistance(user_id, comment_id)

		if (existance.status == true) {
			if (existance.existance == true) {

				if (validId) {
					try {
						await CommentModel.updateOne(
							{ _id: comment_id },
							{ '$pull': { 
								'likers': user_id
							} }
						)

						return {
							status: true,
							message: 'Unliked comment',
							comment_id: comment_id,
							user_id: user_id,
						}
					}
					catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
				}
				else { return { status: false, message: 'Invalid Comment ID.' } }
			}
			else { return { status: false, message: existance.message } }
		}
		else { return { status: false, message: existance.message } }
	}


	// [LIKE-EXISTANCE] //
	static async LikeExistance(user_id, comment_id) {
		try {	
			const returnedData = await CommentModel.findOne(
				{
					_id: comment_id,
					likers: user_id
				}
			)

			if (returnedData) {
				return {
					status: true,
					message: 'Comment Like does exists',
					existance: true,
				}
			}
			else {
				return {
					status: true,
					message: 'Comment Like does NOT exists',
					existance: false,
				}
			}
		}
		catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
	}

	
	/******************* [EXISTANCE + OWNERSHIP] *******************/
	// [EXISTANCE] //
	static async existance(comment_id) {
		if (mongoose.isValidObjectId(comment_id)) {
			try {	
				const returnedData = await CommentModel.findOne({ _id: comment_id })

				if (returnedData) {
					return {
						status: true,
						message: 'Comment does exists',
						existance: true,
					}
				}
				else {
					return {
						status: true,
						message: 'Comment does NOT exists',
						existance: false,
					}
				}
			}
			catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
		}
		else { return { status: false, message: 'Invalid comment ID' } }
	}


	// [OWNERSHIP] //
	static async ownership(user_id, comment_id) {
		if (mongoose.isValidObjectId(comment_id)) {
			try {	
				const returnedData = await CommentModel.findOne(
					{
						user: user_id,
						_id: comment_id,
					}
				)

				if (returnedData) {
					return {
						status: true,
						message: 'Comment does exists',
						ownership: true,
					}
				}
				else {
					return {
						status: true,
						message: 'Comment does NOT exists',
						ownership: false,
					}
				}
			}
			catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
		}
		else { return { status: false, message: 'Invalid comment ID' } }
	}


	/******************* [COUNT] *******************/
	static async count(block_id) {
		try { return await CommentModel.countDocuments({ block_id: block_id }) }
		catch(e) { return `Caught Error --> ${e}` }
	}
}


// [EXPORT] //
module.exports = CommentsCollection