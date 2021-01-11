// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const commentsCollection = require('./commentsCollection')
const PreeditCommentModel = require('../s-models/PreeditedCommentModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, comment_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'preeditedCommentsCollection: Invalid user_id',
			}
		}

		// [VALIDATE] comment_id //
		if (!mongoose.isValidObjectId(comment_id)) {
			return {
				executed: true,
				status: false,
				message: 'preeditedCommentsCollection: Invalid comment_id',
			}
		}

		// [READ] //
		const { comment } = await commentsCollection.c_read(user_id, comment_id)

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
			message: `preeditedCommentsCollection: Error --> ${err}`,
		}
	}
}


// [EXPORT] //
module.exports = {
	c_create,
}