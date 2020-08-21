/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK LIKES COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const BlockLikeModel = require('../server-models/BlockLikeModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, block_id) => {
	const existance = await c_existance(user_id, block_id)

	if (existance.status && !existance.existance) {
		const formData = new BlockLikeModel(
			{
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				block: block_id,
			}
		)

		try {
			const createdBlockLike = await formData.save()

			return {
				status: true,
				message: 'Created blockLike',
				createdBlockLike: createdBlockLike,
			}
		}
		catch (e) {
			return {
				status: false,
				message: `blockLikesCollection: Caught Error --> ${e}`,
			}
		}
	}
	else { return existance }
}

// [DELETE] //
const c_delete = async (user_id, block_id) => {
	try {
		const deletedBlockLike = await BlockLikeModel.deleteMany(
			{
				user: user_id,
				block: block_id,
			}
		)

		return {
			status: true,
			message: `Deleted blockLike`,
			deletedBlockLike: deletedBlockLike,
		}
	}
	catch (e) {
		return {
			status: false,
			message: `blockLikesCollection: Caught Error --> ${e}`,
		}
	}
}


// [DELETE-ALL] //
const c_deleteAll = async (block_id) => {
	try {
		const deletedBlockLike = await BlockLikeModel.deleteMany({ block: block_id })

		return {
			status: true,
			message: `Deleted all blockLikes`,
			deletedBlockLike: deletedBlockLike,
		}
	}
	catch (e) {
		return {
			status: false,
			message: `deletedBlockLike: Caught Error --> ${e}`,
		}
	}
}


/******************* [EXISTANCE] *******************/
// [EXISTANCE] //
const c_existance = async (user_id, block_id) => {
	if (mongoose.isValidObjectId(block_id)) {
		try {
			const returned = await BlockLikeModel.findOne(
				{
					user: user_id,
					block: block_id,
				}
			)

			if (returned) {
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
		catch (e) {
			return {
				status: false,
				message: `blockLikesCollection: Caught Error --> ${e}`,
			}
		}
	}
	else { return { status: false, message: 'Invalid block_id', } }
}


/******************* [COUNT] *******************/
const c_countAll = async (block_id) => {
	try {
		const count = await BlockLikeModel.countDocuments({ block: block_id })

		return { status: true, count: count }
	}
	catch (e) {
		return {
			status: false,
			message: `blockLikesCollection: Caught Error --> ${e}`
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