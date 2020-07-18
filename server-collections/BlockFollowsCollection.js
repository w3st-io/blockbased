/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% FOLLOWS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%% *
 */
// [REQUIRE] //
const mongoose = require('mongoose')
require('dotenv').config()


// [REQUIRE] Personal //
const BlockFollowModel = require('../server-models/BlockFollowModel')


// [MONGOOSE CONNECT] //
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})


class BlockFollowsCollection {
	/******************* [CRUD] *******************/
	// [CREATE] //
	static async create(user_id, block_id) {
		const formData = new BlockFollowModel(
			{
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				block: block_id,
			}
		)

		try {
			formData.save()

			return {
				status: true,
				message: 'Created blockLike',
				block: block_id,
				user: user_id,
			}
		}
		catch(e) {
			return {
				status: false,
				message: `Caught Error --> ${e}`,
				user: user_id,
				block: block_id,
			}
		}
	}


	// [DELETE] //
	static async delete(user_id, block_id) {
		try {
			await BlockFollowModel.deleteMany({ user: user_id, block: block_id, })

			return {
				status: true,
				message: `Deleted all block likes for ${block_id}`,
				user: user_id,
				block: block_id,
			}
		}
		catch(e) {
			return {
				status: false,
				message: `Caught Error --> ${e}`,
				user: user_id,
				block: block_id,
			}
		}
	}


	/******************* [EXISTANCE] *******************/
	// [EXISTANCE] //
	static async existance(user_id, block_id) {
		if (mongoose.isValidObjectId(block_id)) {
			try {
				const returnedData = await BlockFollowModel.findOne(
					{
						user: user_id,
						block: block_id,
					}
				)
	
				if (returnedData) {
					return {
						status: true,
						message: 'BlockLike does exists',
						existance: true,
					}
				}
				else {
					return {
						status: true,
						message: 'BlockLike does NOT exists',
						existance: false,
					}
				}
			}
			catch(e) { return { status: false, message: `Caught Error --> ${e}`, } }
		}
		else { return { status: false, message: 'Invalid Block ID', } }
	}
}


// [EXPORT] //
module.exports = BlockFollowsCollection
