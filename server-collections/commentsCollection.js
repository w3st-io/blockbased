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
	if (text.length >= 6000) {
		return {
			executed: true,
			status: false,
			message: 'Comment too long',
		}
	}

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
const c_read = async (_id) => {
	if (!mongoose.isValidObjectId(_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment _id',
		}
	}

	try {
		const comment = await CommentModel.findById(_id)
			.populate({ path: 'user', select: 'username email profileImg' })
			.populate({ path: 'likers', select: '_id user_id post_id text' })
			.exec()

		if (!comment) {
			return {
				executed: true,
				status: false,
				message: 'No comment found',
			}
		}

		return {
			executed: true,
			status: true,
			comment: comment
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


// [UPDATE] //
const c_update = async (_id, text) => {
	if (!mongoose.isValidObjectId(_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment _id',
			updated: false,
		}
	}

	if (text.length >= 6000) {
		return {
			executed: true,
			status: false,
			message: 'Comment too long',
			updated: false,
		}
	}

	try {
		const comment = await CommentModel.updateOne(
			{ _id: _id },
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


// [DELETE] //
const c_delete = async (_id, user_id) => {
	if (!mongoose.isValidObjectId(_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment _id',
		}
	}

	try {
		const deletedComment = await CommentModel.findOneAndRemove(
			{
				_id: _id,
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


/******************* [EXISTANCE] *******************/
const c_existance = async (_id) => {
	if (!mongoose.isValidObjectId(_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment _id'
		}
	}

	try {	
		const comment = await CommentModel.findOne({ _id: _id })

		if (!comment) {
			return {
				executed: true,
				status: true,
				message: 'Comment does NOT exist',
				existance: false,
			}
		}

		return {
			executed: true,
			status: true,
			message: 'Comment does exist',
			existance: true,
			comment: comment,
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


/******************* [OWNERSHIP] *******************/
const c_ownership = async (_id, user_id) => {
	if (!mongoose.isValidObjectId(_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment _id'
		}
	}

	try {	
		const comment = await CommentModel.findOne(
			{
				user: user_id,
				_id: _id,
			}
		)

		if (!comment) {
			return {
				executed: true,
				status: true,
				message: 'You do NOT own this comment',
				ownership: false,
			}
		}

		return {
			executed: true,
			status: true,
			message: 'You own this comment',
			ownership: true,
			comment: comment,
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