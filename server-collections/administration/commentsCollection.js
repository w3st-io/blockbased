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
const c_delete = async (_id) => {
	if (!mongoose.isValidObjectId(_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment_id',
		}
	}

	try {
		const deletedComment = await CommentModel.findOneAndRemove({ _id })

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


// [EXPORT] //
module.exports = {
	c_delete,
}