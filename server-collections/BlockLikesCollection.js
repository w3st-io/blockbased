/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK LIKES COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')
require('dotenv').config()


// [REQUIRE] Personal //
const BlockLikeModel = require('../server-models/BlockLikeModel')


// [MONGOOSE CONNECT] //
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})


class BlockLikesCollection {
	/******************* [CRUD] *******************/
	// [CREATE] //
	static async create(user_id, block_id) {
		const formData = new BlockLikeModel(
			{
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				block: block_id,
			}
		)

		try { formData.save() }
		catch(e) {
			return {
				status: false,
				user: user_id,
				block: block_id,
				message: `Caught Error --> ${e}`,
			}
		}
			
		return {
			status: true,
			user: user_id,
			block: block_id,
			message: `Created blockLike for ${block_id}.`
		}
	}


	// [DELETE] //
	static async delete(user_id, block_id) {
		try {
			await BlockLikeModel.deleteMany(
				{
					user: user_id,
					block: block_id,
				}
			)
		}
		catch(e) {
			return {
				status: false,
				user: user_id,
				block: block_id,
				message: `Caught Error --> ${e}`,
			}
		}
		 
		return {
			status: true,
			user: user_id,
			block: block_id,
			message: `Deleted all block likes for ${block_id}.`
		}
	}


	// [DELETE-ALL] //
	static async deleteAll(block_id) {
		try { await BlockLikeModel.deleteMany({ block: block_id }) }
		catch(e) {
			return {
				status: false,
				block: block_id,
				message: `Caught Error --> ${e}`,
			}
		}

		return {
			status: true,
			block: block_id,
			message: `Deleted all block likes for ${block_id}.`
		}
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