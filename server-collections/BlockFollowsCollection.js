/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% FOLLOWS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%% *
 */
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const BlockFollowModel = require('../server-models/BlockFollowModel')


class BlockFollowsCollection {
	/******************* [CRUD] *******************/
	// [CREATE] //
	static async create(user_id, block_id) {
		const existance = await this.existance(user_id, block_id)

		if (existance.status && !existance.existance) {
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
					message: 'Created blockFollow',
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
		else { return { status: false, message: existance.message } }
	}


	// [DELETE] //
	static async delete(user_id, block_id) {
		try {
			await BlockFollowModel.deleteMany({ user: user_id, block: block_id, })

			return {
				status: true,
				message: `Deleted blockFollow`,
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
						message: 'BlockFollow does exists',
						existance: true,
					}
				}
				else {
					return {
						status: true,
						message: 'BlockFollow does NOT exists',
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
