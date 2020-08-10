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
// [DELETE] //
const c_delete = async (block_id) => {
	if (mongoose.isValidObjectId(block_id)) {
		try {
			await BlockModel.findByIdAndDelete(
				block_id,
				function (e, block) {
					if (e) {
						return { status: false, message: `Caught Error --> ${e}`, }
					}
					else {
						return {
							status: true,
							message: 'Deleted block',
							block_id: block_id,
							block: block,
						}
					}
				}
			)
		}
		catch(e) { return { status: false, message: `Caught Error --> ${e}`, } }
	}
	else {
		return {
			status: false,
			message: 'Invalid Block ID',
			block_id: block_id,
		}
	}
}


// [EXPORT] //
module.exports = {
	c_delete,
}
