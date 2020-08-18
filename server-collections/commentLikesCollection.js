/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT LIKES COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const CommentLikeModel = require('../server-models/CommetLikeModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, block_id, comment_id) => {
	const existance = await c_existance(user_id, comment_id)

	if (existance.status && !existance.existance) {
		const formData = new CommentLikeModel(
			{
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				block: block_id,
				comment: comment_id,
			}
		)
		
		try {
			const createdCommentLike = await formData.save()

			return {
				status: true,
				message: 'Created commentLike',
				createdCommentLike: createdCommentLike,
			}
		}
		catch(e) {
			return {
				status: false,
				message: `commentLikesCollection: Caught Error --> ${e}`,
			}
		}
	}
	else { return { status: false, message: existance.message } }
}

// [DELETE] //
const c_delete = async (user_id, comment_id) => {
	try {
		const deletedCommentLike = await CommentLikeModel.deleteMany(
			{
				user: user_id,
				comment: comment_id,
			}
		)

		return {
			status: true,
			message: 'Deleted CommentLike',
			deletedCommentLike: deletedCommentLike,
		}
	}
	catch(e) {
		return {
			status: false,
			message: `commentLikesCollection: Caught Error --> ${e}`,
		}
	}
}

// [DELETE-ALL] //
const c_deleteAll = async (comment_id) => {
	try {
		const deletedCommentLikes = await CommentLikeModel.deleteMany(
			{ comment: comment_id }
		)

		return {
			status: true,
			message: 'Deleted All CommentLike for this comment',
			deletedCommentLikes: deletedCommentLikes
		}
	}
	catch(e) {
		return {
			status: false,
			message: `commentLikesCollection: Caught Error --> ${e}`,
		}
	}
}


/******************* [EXISTANCE] *******************/
// [EXISTANCE] //
const c_existance = async (user_id, comment_id) => {
	if (mongoose.isValidObjectId(comment_id)) {
		try {
			const returnedData = await CommentLikeModel.findOne(
				{
					user: user_id,
					comment: comment_id,
				}
			)

			if (returnedData) {
				return {
					status: true,
					message: 'CommentLike does exists',
					existance: true,
				}
			}
			else {
				return {
					status: true,
					message: 'CommentLike does NOT exists',
					existance: false,
				}
			}
		}
		catch(e) {
			return {
				status: false,
				message: `commentLikesCollection: Caught Error --> ${e}`,
			}
		}
	}
	else { return { status: true, message: 'Invalid block_id', } }
}


/******************* [COUNT] *******************/
const c_countAll = async (comment_id) => {
	try {
		const count = await CommentLikeModel.countDocuments({ comment: comment_id })

		return { status: true, count: count }
	}
	catch(e) {
		return {
			status: false,
			message: `commentLikesCollection: Caught Error --> ${e}`,
		}
	}
}


// [EXPORT] //
module.exports = {
	c_create,
	c_delete,
	c_deleteAll,
	c_existance,
	c_countAll,
}