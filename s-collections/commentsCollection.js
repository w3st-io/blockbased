/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENTS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const CommentModel = require('../s-models/CommentModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, post_id, text) => {
	// [VALIDATE] user_id //
	if (!mongoose.isValidObjectId(user_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid user_id',
		}
	}

	// [VALIDATE] post_id //
	if (!mongoose.isValidObjectId(post_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid post_id',
		}
	}

	// [VALIDATE] text //
	if (!text) {
		return {
			executed: true,
			status: false,
			message: 'Invalid text',
		}
	}

	// Text Length //
	if (text.length >= 6000) {
		return {
			executed: true,
			status: false,
			message: 'Comment too long',
		}
	}

	try {
		// [SAVE] //
		const comment = await new CommentModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			post: post_id,
			text,
		}).save()
		
		return {
			executed: true,
			status: true,
			comment: comment,
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
	// [SANTIZE] //
	skip = parseInt(skip)
	limit = parseInt(limit)

	// [VALIDATE] skip //
	if (!Number.isInteger(skip)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid skip',
		}
	}

	// [VALDIATE] limit //
	if (!Number.isInteger(limit)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid limit',
		}
	}

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
			comments: comments,
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
	// [SANTIZE] //
	skip = parseInt(skip)
	limit = parseInt(limit)

	// [VALIDATE] post_id //
	if (!mongoose.isValidObjectId(post_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid post_id',
		}
	}

	// [VALIDATE] skip //
	if (!Number.isInteger(skip)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid skip',
		}
	}

	// [VALDIATE] limit //
	if (!Number.isInteger(limit)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid limit',
		}
	}

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
	// [VALIDATE] //
	if (!mongoose.isValidObjectId(comment_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment_id',
		}
	}

	try {
		const comment = await CommentModel.findById(comment_id)
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
const c_update = async (comment_id, user_id, text) => {
	// [VALIDATE] //
	if (!mongoose.isValidObjectId(comment_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment_id',
			updated: false,
		}
	}

	// [VALIDATE] user_id //
	if (!mongoose.isValidObjectId(user_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid user_id',
			updated: false,
		}
	}

	// [VALIDATE] text //
	if (!text) {
		return {
			executed: true,
			status: false,
			message: 'Invalid text',
		}
	}

	// Length //
	if (text.length >= 6000) {
		return {
			executed: true,
			status: false,
			message: 'Comment too long',
			updated: false,
		}
	}

	try {
		// [OWNERSHIP] //
		const ownership = await c_ownership(comment_id, user_id)

		if (!ownership.status || !ownership.ownership) {
			return {
				executed: true,
				status: false,
				message: ownership.message
			}
		}
	
		const comment = await CommentModel.updateOne(
			{
				_id: comment_id,
				user: user_id
			},
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
const c_delete = async (comment_id, user_id) => {
	// [VALIDATE] //
	if (!mongoose.isValidObjectId(comment_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment_id',
			updated: false,
		}
	}

	// [VALIDATE] user_id //
	if (!mongoose.isValidObjectId(user_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid user_id',
			updated: false,
		}
	}

	try {
		// [OWNERSHIP] //
		const ownership = await c_ownership(comment_id, user_id)

		if (!ownership.status || !ownership.ownership) {
			return {
				executed: true,
				status: false,
				message: ownership.message
			}
		}

		const deletedComment = await CommentModel.findOneAndRemove({
			_id: comment_id,
			user: user_id,
		})

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


/******************* [ADMIN-CRUD] *******************/
// [ADMIN-DELETE] //
const c_adminDelete = async (comment_id) => {
	// [VALIDATE] //
	if (!mongoose.isValidObjectId(comment_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment comment_id',
		}
	}

	try {
		const deletedComment = await CommentModel.findOneAndRemove({ _id: comment_id })

		return {
			executed: true,
			status: true,
			deleted: true,
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


/******************* [OWNERSHIP] *******************/
const c_ownership = async (comment_id, user_id) => {
	// [VALIDATE] //
	if (!mongoose.isValidObjectId(comment_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment_id',
			updated: false,
		}
	}

	// [VALIDATE] user_id //
	if (!mongoose.isValidObjectId(user_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid user_id',
			updated: false,
		}
	}

	try {	
		const comment = await CommentModel.findOne({ _id: comment_id, user: user_id, })

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
			message: 'You do own this comment',
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


/******************* [EXISTANCE] *******************/
const c_existance = async (comment_id) => {
	// [VALIDATE] //
	if (!mongoose.isValidObjectId(comment_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment_id'
		}
	}

	try {	
		const comment = await CommentModel.findOne({ _id: comment_id })

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


/******************* [COUNT] *******************/
const c_countAll = async (post_id) => {
	// [VALIDATE] post_id //
	if (!mongoose.isValidObjectId(post_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid post_id'
		}
	}

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
	c_adminDelete,
	c_existance,
	c_ownership,
	c_countAll,
}