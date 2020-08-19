/**
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCKS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] //
const BlockModel = require('../server-models/BlockModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, cat_id, title) => {
	const formData = new BlockModel({
		_id: mongoose.Types.ObjectId(),
		user: user_id,
		cat_id: cat_id,
		title: title,
	})

	try {
		const createdBlock = await formData.save()

		return {
			status: true,
			message: 'Created block',
			createdBlock: createdBlock,
		}
	}
	catch (e) {
		return {
			status: false,
			message: `blocksCollection: Caught Error --> ${e}`,
		}
	}
}


// [READ-ALL] Within Cat //
const c_readAll = async (cat_id, skip, amount) => {
	const skip2 = parseInt(skip)
	const amount2 = parseInt(amount)

	try {
		const blocks = await BlockModel.find(
			{ cat_id: cat_id }
		)
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
		return { status: false, message: `blocksCollection: Caught Error --> ${e}`, }
	}
}

// [READ] Single Block //
const c_read = async (block_id) => {
	if (mongoose.isValidObjectId(block_id)) {
		try {
			const block = await BlockModel.findById(block_id)
				.populate(
					{
						path: 'user',
						select: 'username email profileImg',
					}
				)
				.exec()
			
			return { status: true, block: block }
		}
		catch (e) {
			return { status: false, message: `blocksCollection: Caught Error --> ${e}` }
		}
	}
	else { return { status: true, message: 'Invalid block_id', } }
}


/******************* [EXISTANCE] *******************/
const c_existance = async (block_id) => {
	if (mongoose.isValidObjectId(block_id)) {
		try {	
			const block = await BlockModel.findOne({ _id: block_id })

			if (block) {
				return {
					status: true,
					message: 'Block does exist',
					existance: true,
					block: block,
				}
			}
			else {
				return {
					status: true,
					message: 'Block does NOT exist',
					existance: false,
					block: block,
				}
			}
		}
		catch (e) {
			return { status: false, message: `blocksCollection: Caught Error --> ${e}` }
		}
	}
	else { return { status: true, message: 'Invalid block_id' } }
}


/******************* [OWNERSHIP] *******************/
const c_ownership = async (user_id, block_id) => {
	if (mongoose.isValidObjectId(block_id)) {
		try {	
			const block = await BlockModel.findOne(
				{
					user: user_id,
					_id: block_id,
				}
			)

			if (returned) {
				return {
					status: true,
					message: 'You own this',
					ownership: true,
					block: block,
				}
			}
			else {
				return {
					status: true,
					message: 'You dont own this',
					ownership: false,
					block: block,
				}
			}
		}
		catch (e) {
			return { status: false, message: `blocksCollection: Caught Error --> ${e}` }
		}
	}
	else { { return { status: true, message: 'Invalid block_id' } } }
}


/******************* [COUNT] *******************/
const c_count = async (cat_id) => {
	try {
		const count = await BlockModel.countDocuments({ cat_id: cat_id })

		return { status: true, count: count }
	}
	catch (e) {
		return { status: false, message: `blocksCollection: Caught Error --> ${e}` }
	}
}


// [EXPORT] //
module.exports = {
	c_create,
	c_readAll,
	c_read,
	c_existance,
	c_ownership,
	c_count,
}
