/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT LIKES COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const CommentLikeModel = require('../server-models/CommetLikeModel')


class CommentLikesCollection {
	/******************* [CRRUD] *******************/
	// [CREATE] //
	static async create(req) {
		const formData = new CommentLikeModel(
			{
				_id: mongoose.Types.ObjectId(),
				user: req.decoded._id,
				block_id: req.body.block_id,
				comment: req.params._id,
			}
		)
		
		try { formData.save() }
		catch(e) { `Caught Error: ${e}` }

		return
	}


	// [DELETE] //
	static async delete(req) {
		try {
			await CommentLikeModel.deleteMany(
				{
					comment: req.params._id,
					user: req.decoded._id,
				}
			)
		}
		catch(e) { return `Caught Error: ${e}` }
			
		return 'Deleted CommentLike.'
	}


	// [DELETE-ALL] //
	static async deleteAll(req) {
		try {
			await CommentLikeModel.deleteMany(
				{ comment: req.params._id }
			)
		}
		catch(e) { return `Caught Error: ${e}` }

		return 'Deleted all CommentLikes for comment.'
	}


	/******************* [EXISTANCE + OWNERSHIP] *******************/
	static async existance(comment_id, user_id) {
		if (mongoose.isValidObjectId(comment_id)) {
			try {
				const returnedData = await CommentLikeModel.findOne(
					{
						comment_id: mongoose.Types.ObjectId(comment_id),
						user_id: mongoose.Types.ObjectId(user_id),
					}
				)
	
				if (returnedData) { return true }
				else { return false }
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Block ID.' }
	}
	

	static async ownership(req) {
		const returnedData = await CommentLikeModel.findOne(
			{
				comment_id: mongoose.Types.ObjectId(req.params.comment_id),
				user_id: mongoose.Types.ObjectId(req.decoded._id),
			}
		)

		if (returnedData) { return true }
		else { return false }
	}
}


// [EXPORT] //
module.exports = CommentLikesCollection