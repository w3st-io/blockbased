/**
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCKS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] //
const BlockModel = require('../../server-models/BlockModel')


/******************* [CRUD] *******************/
// [READ-ALL-ALL] //
const c_readAllAll = async (skip, amount) => {
	const skip2 = parseInt(skip)
	const amount2 = parseInt(amount)

	try {
		const blocks = await BlockModel.find()
			.skip(skip2)
			.limit(amount2)
			.populate(
				{
					path: 'user',
					select: 'username email profileImg',
				}
			)
			.exec()

		return { status: true, blocks: blocks }
	}
	catch (e) {
		return {
			status: false,
			message: `blockCollections: Caught Error --> ${e}`,
		}
	}
}


// [DELETE] //
const c_delete = async (block_id) => {
	if (mongoose.isValidObjectId(block_id)) {
		try {
			const deletedBlock = await BlockModel.findByIdAndDelete(block_id)
			
			return {
				status: true,
				deleted: true,
				deletedBlock: deletedBlock,
			}
		}
		catch (e) {
			return {
				status: false,
				message: `blockCollections: Caught Error --> ${e}`,
				deleted: false,
			}
		}
	}
	else {
		return {
			status: false,
			message: 'blocksCollection: Invalid block_id',
			deleted: false,
		}
	}
}


// [EXPORT] //
module.exports = {
	c_readAllAll,
	c_delete,
}
