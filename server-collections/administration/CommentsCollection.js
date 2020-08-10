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
				status: true,
				message: 'Deleted comment.',
				comment_id: comment_id,
				deletedComment: deletedComment,
			}
		}
		catch(e) {
			return {
				status: false,
				message: `Caught Error --> ${e}`,
				comment_id: comment_id,
			}
		}
	}
	else {
		return {
			status: false,
			message: 'Invalid Comment ID',
			comment_id: comment_id,
		}
	}
}


// [EXPORT] //
module.exports = {
	c_delete,
}