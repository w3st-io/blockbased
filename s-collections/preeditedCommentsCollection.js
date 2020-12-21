/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%
 * %%% COMMENTS COLLECTION %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%
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


// [EXPORT] //
module.exports = {
	c_create,
}