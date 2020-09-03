/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENTS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const CommentModel = require('../../server-models/CommentModel')


/******************* [CRUD] *******************/
// [DELETE] //
const c_delete = async (comment_id) => {
	if (mongoose.isValidObjectId(comment_id)) {
		try {
			const deletedComment = await CommentModel.findOneAndRemove(
				{ _id: comment_id, }
			)

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
	else {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment _id',
		}
	}
}


// [EXPORT] //
module.exports = {
	c_delete,
}