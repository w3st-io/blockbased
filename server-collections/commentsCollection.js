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
const c_create = async (user_id, post_id, text) => {
	if (text.length <= 6000) {
		const formData = new CommentModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			post: post_id,
			text: text,
		})

		try {
			const createdComment = await formData.save()
			
			return {
				executed: true,
				status: true,
				createdComment: createdComment,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `commentsCollection: Error --> ${err}`,
			}
		}
	}
	else {
		return {
			executed: true,
			status: false,
			message: `Comment too long`,
		}
	}
}


// [READ-ALL-ALL] //
const c_readAllAll = async (skip, limit) => {
	try {
		const comments = await CommentModel.find()
			.skip(parseInt(skip))
			.limit(parseInt(limit))
			.populate({ path: 'user', select: 'username email profileImg', })
			.populate({ path: 'post' })
			.exec()

		return {
			executed: true,
			status: true,
			comments: comments
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentsCollection: Error --> ${err}`,
		}
	}
}


// [READ-ALL] Within a Post //
const c_readAll = async (post_id, skip, limit) => {
	try {
		const comments = await CommentModel.find({ post: post_id })
			.skip(parseInt(skip))
			.limit(parseInt(limit))
			.populate({ path: 'user', select: 'username email profileImg', })
			.exec()

		return {
			executed: true,
			status: true,
			comments: comments
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentsCollection: Error --> ${err}`,
		}
	}
}


// [READ] //
const c_read = async (comment_id) => {
	if (mongoose.isValidObjectId(comment_id)) {
		try {
			const comment = await CommentModel.findById(comment_id)
				.populate({ path: 'user', select: 'username email profileImg' })
				.populate({ path: 'likers', select: '_id user_id post_id text' })
				.exec()

			if (comment) {
				return {
					executed: true,
					status: true,
					comment: comment
				}
			}
			else {
				return {
					executed: true,
					status: false,
					message: 'No comment found',
				}
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `commentsCollection: Error --> ${err}`,
			}
		}
	}
	else {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment_id',
		}
	}
}


// [UPDATE] //
const c_update = async (comment_id, text) => {
	if (mongoose.isValidObjectId(comment_id)) {
		if (text.length <= 6000) {
			try {
				const comment = await CommentModel.updateOne(
					{ _id: comment_id },
					{ $set: { text: text } },
				)

				return {
					executed: true,
					status: true,
					updated: true,
					comment: comment,

				}
			}
			catch (err) {
				return {
					executed: false,
					status: false,
					message: `commentsCollection: Error --> ${err}`,
					updated: false,
				}
			}
		}
		else {
			return {
				executed: true,
				status: false,
				message: `Comment too long`,
				updated: false,
			}
		}
	}
	else {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment_id',
			updated: false,
		}
	}
}


// [DELETE] //
const c_delete = async (user_id, comment_id) => {
	if (mongoose.isValidObjectId(comment_id)) {
		try {
			const deletedComment = await CommentModel.findOneAndRemove(
				{
					_id: comment_id,
					user: user_id,
				}
			)

			return {
				executed: true,
				status: true,
				deletedComment: deletedComment,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `commentsCollection: Error --> ${err}`,
			}
		}
	}
	else {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment_id',
		}
	}
}


/******************* [EXISTANCE] *******************/
const c_existance = async (comment_id) => {
	if (mongoose.isValidObjectId(comment_id)) {
		try {	
			const comment = await CommentModel.findOne({ _id: comment_id })

			if (comment) {
				return {
					executed: true,
					status: true,
					existance: true,
					comment: comment,
				}
			}
			else {
				return {
					executed: true,
					status: true,
					existance: false,
				}
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `commentsCollection: Error --> ${err}`
			}
		}
	}
	else {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment_id'
		}
	}
}


/******************* [OWNERSHIP] *******************/
const c_ownership = async (user_id, comment_id) => {
	if (mongoose.isValidObjectId(comment_id)) {
		try {	
			const comment = await CommentModel.findOne(
				{
					user: user_id,
					_id: comment_id,
				}
			)

			if (comment) {
				return {
					executed: true,
					status: true,
					message: 'You own this comment',
					ownership: true,
					comment: comment,
				}
			}
			else {
				return {
					executed: true,
					status: true,
					message: 'You do NOT own this comment',
					ownership: false,
				}
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `commentsCollection: Error --> ${err}`
			}
		}
	}
	else {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment_id'
		}
	}
}


/******************* [COUNT] *******************/
const c_countAll = async (post_id) => {
	try {
		const count = await CommentModel.countDocuments({ post: post_id })

		return {
			executed: true,
			status: true,
			count: count
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentsCollection: Error --> ${err}`
		}
	}
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