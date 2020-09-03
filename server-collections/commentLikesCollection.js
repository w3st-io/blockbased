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
const c_create = async (user_id, post_id, comment_id) => {
	const existance = await c_existance(user_id, comment_id)

	if (existance.status && !existance.existance) {
		const formData = new CommentLikeModel(
			{
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				post: post_id,
				comment: comment_id,
			}
		)
		
		try {
			const createdCommentLike = await formData.save()

			return {
				executed: true,
				status: true,
				createdCommentLike: createdCommentLike,
			}
		}
		catch (e) {
			return {
				executed: false,
				status: false,
				message: `commentLikesCollection: Error --> ${e}`,
			}
		}
	}
	else { return existance }
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
			executed: true,
			status: true,
			deletedCommentLike: deletedCommentLike,
		}
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `commentLikesCollection: Error --> ${e}`,
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
			executed: true,
			status: true,
			deletedCommentLikes: deletedCommentLikes
		}
	}
	catch (e) {
		return {
			executed: true,
			status: false,
			message: `commentLikesCollection: Error --> ${e}`,
		}
	}
}


/******************* [EXISTANCE] *******************/
// [EXISTANCE] //
const c_existance = async (user_id, comment_id) => {
	if (mongoose.isValidObjectId(comment_id)) {
		try {
			const returned = await CommentLikeModel.findOne(
				{
					user: user_id,
					comment: comment_id,
				}
			)

			if (returned) {
				return {
					executed: true,
					status: true,
					existance: true,
				}
			}
			else {
				return {
					executed: true,
					status: true,
					existance: false,
				}
			}
		}
		catch (e) {
			return {
				executed: false,
				status: false,
				message: `commentLikesCollection: Error --> ${e}`,
			}
		}
	}
	else {
		return {
			executed: true,
			status: false,
			message: 'Invalid post_id',
		}
	}
}


/******************* [COUNT] *******************/
const c_countAll = async (comment_id) => {
	try {
		const count = await CommentLikeModel.countDocuments({ comment: comment_id })

		return {
			executed: true,
			status: true,
			count: count
		}
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `commentLikesCollection: Error --> ${e}`,
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