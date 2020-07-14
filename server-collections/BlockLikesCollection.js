/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK LIKES COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const BlockLikeModel = require('../server-models/BlockLikeModel')


class BlockLikesCollection {
	/******************* [CRRUD] *******************/
	// [CREATE] //
	static async create(req) {
		const formData = new BlockLikeModel(
			{
				_id: mongoose.Types.ObjectId(),
				user: req.decoded._id,
				block: req.params._id,
			}
		)
		try { formData.save() }
		catch(e) { return `Caught Error: ${e}` }
			
		return
	}


	// [DELETE] //
	static async delete(req) {
		try {
			await BlockLikeModel.deleteMany(
				{
					block: req.params._id,
					user: req.decoded._id,
				}
			)
		}
		catch(e) { return `Caught Error: ${e}` }
		 
		return
	}


	// [DELETE-ALL] //
	static async deleteAll(req) {
		try { await BlockLikeModel.deleteMany({ block: req.params.block_id }) }
		catch(e) { return `Caught Error: ${e}` }

		return
	}


	/******************* [EXISTANCE + OWNERSHIP] *******************/
	static async existance(block_id, user_id) {
		if (mongoose.isValidObjectId(block_id)) {
			try {
				const returnedData = await BlockLikeModel.findOne(
					{
						block: block_id,
						user: user_id,
					}
				)
	
				if (returnedData) { return false }
				else { return true }
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Block ID.' }
	}
	

	static async ownership(req) {
		const returnedData = await BlockLikeModel.findOne(
			{
				block: req.params.block_id,
				user: req.decoded._id,
			}
		)

		if (returnedData) { return true }
		else { return false }
	}
}


// [EXPORT] //
module.exports = BlockLikesCollection