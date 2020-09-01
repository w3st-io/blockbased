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
				status: true,
				createdComment: createdComment,
			}
		}
		catch (e) {
			return {
				status: false,
				message: `commentsCollection: Caught Error --> ${e}`,
			}
		}
	}
	else {
		return {
			status: false,
			message: `commentsCollection: Comment too long`,
		}
	}
}

// [READ-ALL-ALL] //
const c_readAllAll = async (skip, limit) => {
	const skip2 = parseInt(skip)
	const limit2 = parseInt(limit)
	
	try {
		const comments = await CommentModel.find()
			.skip(skip2)
			.limit(limit2)
			.populate(
				{
					path: 'user',
					select: 'username email profileImg',
				}
			)
			.populate('post')
			.exec()

		return { status: true, comments: comments }
	}
	catch (e) {
		return {
			status: false,
			message: `commentsCollection: Caught Error --> ${e}`,
		}
	}
}

// [READ-ALL] Within a Post //
const c_readAll = async (post_id, skip, limit) => {
	const skip2 = parseInt(skip)
	const limit2 = parseInt(limit)

	try {
		const comments = await CommentModel.find({ post: post_id })
			.skip(skip2)
			.limit(limit2)
			.populate(
				{
					path: 'user',
					select: 'username email profileImg',
				}
			)
			.exec()

		return { status: true, comments: comments }
	}
	catch (e) {
		return {
			status: false,
			message: `commentsCollection: Caught Error --> ${e}`,
		}
	}
}

// [READ] //
const c_read = async (comment_id) => {
	if (mongoose.isValidObjectId(comment_id)) {
		try {
			const comment = await CommentModel.findById(comment_id)
				.populate(
					{
						path: 'user',
						select: 'username email profileImg'
					}
				)
				.populate(
					{
						path: 'likers',
						select: '_id user_id post_id text'
					}
				)
				.exec()

			return { status: true, comment: comment }
		}
		catch (e) {
			return {
				status: false,
				message: `commentsCollection: Caught Error --> ${e}`,
			}
		}
	}
	else {
		return {
			status: true,
			message: 'commentsCollection: Invalid comment_id',
		}
	}
}

// [UPDATE] //
const c_update = async (comment_id, text) => {
	if (mongoose.isValidObjectId(comment_id)) {
		if (text.length <= 6000) {
			try {
				const updatedCollent = await CommentModel.updateOne(
					{ _id: comment_id },
					{ $set: { 'text': text } },
				)

				return {
					status: true,
					updatedCollent: updatedCollent,
				}
			}
			catch (e) {
				return {
					status: false,
					message: `commentsCollection: Caught Error --> ${e}`,
				}
			}
		}
		else {
			return {
				status: false,
				message: `Comment too long`,
			}
		}
	}
	else {
		return {
			status: true,
			message: 'commentsCollection: Invalid comment_id',
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
				status: true,
				deletedComment: deletedComment,
			}
		}
		catch (e) {
			return {
				status: false,
				message: `commentsCollection: Caught Error --> ${e}`,
			}
		}
	}
	else {
		return {
			status: false,
			message: 'commentsCollection: Invalid comment_id',
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
					status: true,
					existance: true,
					comment: comment,
				}
			}
			else {
				return {
					status: true,
					existance: false,
					comment: comment,
				}
			}
		}
		catch (e) {
			return {
				status: false,
				message: `commentsCollection: Caught Error --> ${e}`
			}
		}
	}
	else {
		return {
			status: false,
			message: 'commentsCollection: Invalid comment_id'
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
					status: true,
					ownership: true,
					comment: comment,
				}
			}
			else {
				return {
					status: true,
					ownership: false,
					comment: comment,
				}
			}
		}
		catch (e) {
			return {
				status: false,
				message: `commentsCollection: Caught Error --> ${e}`
			}
		}
	}
	else {
		return { status: false, message: 'commentsCollection: Invalid comment_id' }
	}
}


/******************* [COUNT] *******************/
const c_countAll = async (post_id) => {
	try {
		const count = await CommentModel.countDocuments({ post: post_id })

		return { status: true, count: count }
	}
	catch (e) {
		return { status: false, message: `commentsCollection: Caught Error --> ${e}` }
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