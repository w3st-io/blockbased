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
	catch(e) {
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
			await BlockModel.findByIdAndDelete(
				block_id,
				function (e, block) {
					if (e) {
						return {
							status: false,
							message: `blockCollections: Caught Error --> ${e}`,
						}
					}
					else {
						return {
							status: true,
							message: 'Deleted block',
							block: block,
						}
					}
				}
			)
		}
		catch(e) {
			return {
				status: false,
				message: `blockCollections: Caught Error --> ${e}`,
			}
		}
	}
	else {
		return { status: true, message: 'Invalid block_id', }
	}
}


// [EXPORT] //
module.exports = {
	c_readAllAll,
	c_delete,
}
