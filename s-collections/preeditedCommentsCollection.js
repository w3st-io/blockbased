/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENTS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const commentsCollection = require('./commentsCollection')
const PreeditCommentModel = require('../s-models/PreeditedCommentModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (comment_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(comment_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid user_id',
			}
		}

		// [READ] //
		const { comment } = await commentsCollection.c_read(comment_id)

		// [SAVE] //
		const preeditedComment = await new PreeditCommentModel({
			_id: mongoose.Types.ObjectId(),
			comment: comment._id,
			user: comment.user,
			post: comment.post,
			text: comment.text,
		}).save()

		return {
			executed: true,
			status: true,
			comment: preeditedComment,
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
const c_readAllAll = async (limit, skip) => {
}


// [READ-ALL] Within a Post //
const c_readAll = async (post_id, limit, skip) => {
}


// [READ] //
const c_read = async (comment_id) => {
}


// [DELETE] //
const c_delete = async (comment_id, user_id) => {
}


/******************* [ADMIN-CRUD] *******************/
// [ADMIN-DELETE] //
const c_adminDelete = async (comment_id) => {
}


/******************* [OWNERSHIP] *******************/
const c_ownership = async (comment_id, user_id) => {
}


/******************* [EXISTANCE] *******************/
const c_existance = async (comment_id) => {
}


/******************* [COUNT] *******************/
const c_countAll = async (post_id) => {
}


// [EXPORT] //
module.exports = {
	c_create,
	c_readAllAll,
	c_readAll,
	c_read,
	c_delete,
	c_adminDelete,
	c_existance,
	c_ownership,
	c_countAll,
}