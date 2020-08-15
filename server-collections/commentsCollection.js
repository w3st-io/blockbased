/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENTS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const CommentModel = require('../server-models/CommentModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, block_id, text) => {
	if (text.length <= 6000) {
		const formData = new CommentModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			block: block_id,
			text: text,
		})

		try {
			const createdComment = await formData.save()
			
			return {
				status: true,
				message: `Created comment in ${block_id}.`,
				createdComment: createdComment,
				user: user_id,
				block_id: block_id,
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
const c_readAllAll = async (skip, limit) => {
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
const c_readAll = async (block_id, skip, limit) => {
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
const c_read = async (comment_id) => {
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
			message: 'Invalid Comment ID',
		}
	}
}


// [UPDATE] //
const c_update = async (comment_id, text) => {
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
					message: 'Updated comment',
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
			message: 'Invalid Comment ID',
		}
	}
}


// [DELETE] //
const c_delete = async (user_id, comment_id) => {
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
				message: 'Deleted comment.',
				user_id: user_id,
				comment_id: comment_id,
			}
		}
		catch(e) {
			return {
				status: false,
				message: `Caught Error --> ${e}`,
				user_id: user_id,
				comment_id: comment_id,
			}
		}
	}
	else {
		return {
			status: false,
			message: 'Invalid Comment ID',
			user_id: user_id,
			comment_id: comment_id,
		}
	}
}


/******************* [EXISTANCE + OWNERSHIP] *******************/
// [EXISTANCE] //
const c_existance = async (comment_id) => {
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
const c_ownership = async (user_id, comment_id) => {
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
const c_countAll = async (block_id) => {
	try { return await CommentModel.countDocuments({ block: block_id }) }
	catch(e) { return `Caught Error --> ${e}` }
}


// [EXPORT] //
module.exports = {
	c_create,
	c_readAllAll,
	c_readAll,
	c_read,
	c_update,
	c_delete,
	c_existance,
	c_ownership,
	c_countAll,
}