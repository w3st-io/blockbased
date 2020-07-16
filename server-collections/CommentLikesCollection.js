/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT LIKES COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')
require('dotenv').config()


// [REQUIRE] Personal //
const CommentLikeModel = require('../server-models/CommetLikeModel')


// [MONGOOSE CONNECT] //
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})


class CommentLikesCollection {
	/******************* [CRUD] *******************/
	// [CREATE] //
	static async create(req) {
		const user_id = req.decoded._id
		const block_id = req.body.block_id
		const comment_id = req.params._id

		const formData = new CommentLikeModel(
			{
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				block: block_id,
				comment: comment_id,
			}
		)
		
		try { formData.save() }
		catch(e) {
			return {
				status: false,
				user: user_id,
				block: block_id,
				comment: comment_id,
				message: `Caught Error --> ${e}`,
			}
		}

		return {
			status: true,
			user: user_id,
			block: block_id,
			comment: comment_id,
			message: 'Created commentLike',
		}
	}


	// [DELETE] //
	static async delete(req) {
		const comment_id = req.params._id
		const user_id = req.decoded._id

		try {
			await CommentLikeModel.deleteMany(
				{
					user: user_id,
					comment: comment_id,
				}
			)
		}
		catch(e) {
			return {
				status: false,
				user: user_id,
				comment: comment_id,
				message: `Caught Error --> ${e}`,
			}
		}
			
		return {
			status: true,
			user: user_id,
			comment: comment_id,
			message: 'Deleted CommentLike',
		}
	}


	// [DELETE-ALL] //
	static async deleteAll(req) {
		const comment_id = req.params._id
		try {
			await CommentLikeModel.deleteMany(
				{ comment: comment_id }
			)
		}
		catch(e) {
			return {
				status: false,
				comment: comment_id,
				message: `Caught Error --> ${e}`,
			}
		}

		return {
			status: true,
			comment: comment_id,
			message: 'Deleted All CommentLike for this comment.',
		}
	}


	/******************* [EXISTANCE + OWNERSHIP] *******************/
	static async existance(comment_id, user_id) {
		if (mongoose.isValidObjectId(comment_id)) {
			try {
				const returnedData = await CommentLikeModel.findOne(
					{
						user: user_id,
						comment: comment_id,
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
				user_id: req.decoded._id,
				comment_id: req.params.comment_id,
			}
		)

		if (returnedData) { return true }
		else { return false }
	}
}


// [EXPORT] //
module.exports = CommentLikesCollection