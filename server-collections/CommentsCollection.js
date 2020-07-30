/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENTS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const CommentModel = require('../server-models/CommentModel')


class CommentsCollection {
	/******************* [CRUD] *******************/
	// [CREATE] //
	static async create(user_id, block_id, text) {
		if (text.length <= 6000) {
			const formData = new CommentModel({
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				block: block_id,
				text: text,
			})

			try {
				await formData.save()
				
				return {
					status: true,
					message: `Created comment in ${block_id}.`,
					user: user_id,
					block_id: block_id,
					commentCreated: formData
				}
			}
			catch(e) {
				return {
					status: false,
					user: user_id,
					block_id: block_id,
					message: `Caught Error --> ${e}`,
				}
			}
		}
		else {
			return {
				status: true,
				message: `Comment too long`,
				user: user_id,
				block_id: block_id,
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
					{
						path: 'user',
						select: 'username email profileImg',
					}
				)
				.populate('block')
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
				{ block: block_id }
			)
				.skip(skip2)
				.limit(limit2)
				.populate(
					{
						path: 'user',
						select: 'username email profileImg',
					}
				)
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
		if (mongoose.isValidObjectId(comment_id)) {
			try {
				const returnedData = await CommentModel.findById(comment_id)
					.populate(
						{
							path: 'user',
							select: 'username email profileImg'
						}
					)
					.populate(
						{
							path: 'likers',
							select: '_id user_id block_id text'
						}
					)
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
		if (mongoose.isValidObjectId(comment_id)) {
			if (text.length <= 6000) {
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
					status: true,
					message: `Comment too long`,
					user: user_id,
					block_id: block_id,
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
		if (mongoose.isValidObjectId(comment_id)) {
			try {
				await CommentModel.findOneAndRemove(
					{
						_id: comment_id,
						user: user_id,
					}
				)

				return {
					status: true,
					user_id: user_id,
					comment_id: comment_id,
					message: 'Deleted comment.',
				}
			}
			catch(e) {
				return {
					status: false,
					user_id: user_id,
					comment_id: comment_id,
					message: `Caught Error --> ${e}`,
				}
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
		const likeExistance = await this.likeExistance(user_id, comment_id)

		if (likeExistance.status && !likeExistance.existance) {
			if (mongoose.isValidObjectId(comment_id)) {
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
		else { return { status: false, message: likeExistance.message } }
	}


	// [UNLIKE] //
	static async unlike(user_id, comment_id) {
		const likeExistance = await this.likeExistance(user_id, comment_id)

		if (likeExistance.status && likeExistance.existance) {
			if (mongoose.isValidObjectId(comment_id)) {
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
		else { return { status: false, message: likeExistance.message } }
	}


	// [LIKE-EXISTANCE] //
	static async likeExistance(user_id, comment_id) {
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
						message: 'You own this comment',
						ownership: true,
					}
				}
				else {
					return {
						status: true,
						message: 'You do NOT own this comment',
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