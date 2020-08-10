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
			await CommentModel.findOneAndRemove(
				{ _id: comment_id, }
			)

			return {
				status: true,
				comment_id: comment_id,
				message: 'Deleted comment.',
			}
		}
		catch(e) {
			return {
				status: false,
				comment_id: comment_id,
				message: `Caught Error --> ${e}`,
			}
		}
	}
	else {
		return {
			status: false,
			comment_id: comment_id,
			message: 'Invalid Comment ID',
		}
	}
}


// [EXPORT] //
module.exports = {
	c_delete,
}