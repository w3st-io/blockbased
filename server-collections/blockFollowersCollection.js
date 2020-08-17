/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% FOLLOWS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%% *
 */
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const BlockFollowerModel = require('../server-models/BlockFollowerModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, block_id) => {
	const existance = await c_existance(user_id, block_id)

	if (existance.status && !existance.existance) {
		const formData = new BlockFollowerModel(
			{
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				block: block_id,
			}
		)

		try {
			const createdBlockFollow = await formData.save()

			return {
				status: true,
				message: 'Created blockFollow',
				createdBlockFollow: createdBlockFollow,
			}
		}
		catch(e) {
			return {
				status: false,
				message: `blockFollowersCollection: Caught Error --> ${e}`,
			}
		}
	}
	else { return { status: false, message: existance.message } }
}

// [READ-ALL] //
const c_readAll = async (block_id) => {
	try {
		const blockFollowers = await BlockFollowerModel.find({ block: block_id })

		return {
			status: true,
			message: 'Found',
			blockFollowers: blockFollowers,
		}
	}
	catch(e) {
		return {
			status: true,
			message: 'blockFollowersCollection: Error',
		}
	}
}

// [DELETE] //
const c_delete = async (user_id, block_id) => {
	try {
		const deletedBlockFollower = await BlockFollowerModel.deleteMany(
			{
				user: user_id,
				block: block_id,
			}
		)

		return {
			status: true,
			message: 'Deleted blockFollow',
			deletedBlockFollower: deletedBlockFollower
		}
	}
	catch(e) {
		return {
			status: false,
			message: `blockFollowersCollection: Caught Error --> ${e}`,
		}
	}
}


/******************* [EXISTANCE] *******************/
const c_existance = async (user_id, block_id) => {
	if (mongoose.isValidObjectId(block_id)) {
		try {
			const blockFollower = await BlockFollowerModel.findOne(
				{
					user: user_id,
					block: block_id,
				}
			)

			if (blockFollower) {
				return {
					status: true,
					message: 'BlockFollow does exists',
					existance: true,
					blockFollower: blockFollower,
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
		catch(e) {
			return {
				status: false,
				message: `blockFollowersCollection: Caught Error --> ${e}`,
			}
		}
	}
	else { return { status: false, message: 'Invalid block_id', } }
}


/******************* [COUNT] *******************/
const c_countAll = async (block_id) => {
	return await BlockFollowerModel.countDocuments({ block: block_id })
}


// [EXPORT] //
module.exports = {
	c_create,
	c_readAll,
	c_delete,
	c_existance,
	c_countAll,
}
