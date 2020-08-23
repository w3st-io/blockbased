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
const c_readAll = async (cat_id, skip, limit, sort) => {
	const skip2 = parseInt(skip)
	const limit2 = parseInt(limit)
	let sort2 = {}

	if (sort == 'descending') { sort2 = { createdAt: -1 } }
	else if (sort == 'popularity') { sort2 = { likeCount: -1 } }

	try {
		const blocks = await BlockModel.find(
			{ cat_id: cat_id }
		)
			.sort(sort2)
			.skip(skip2)
			.limit(limit2)
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
			message: `blocksCollection: Caught Error --> ${e}`,
		}
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
			return {
				status: false,
				message: `blocksCollection: Caught Error --> ${e}`
			}
		}
	}
	else {
		return {
			status: false,
			message: 'blocksCollection: Invalid block_id',
		}
	}
}


/******************* [LIKE-SYSTEM] *******************/
const c_incrementLike = async (block_id) => {
	try {
		const block = await BlockModel.findOneAndUpdate(
			{ _id: block_id },
			{ $inc: { likeCount: 1 } },
		)
	
		return { status: true, block: block }
	}
	catch (e) {
		return {
			status: false,
			message: `blocksCollection: Caught Error --> ${e}`
		}
	}
}


const c_decrementLike = async (block_id) => {
	try {
		const block = await BlockModel.findOneAndUpdate(
			{ _id: block_id },
			{ $inc: { likeCount: -1 } },
		)
	
		return { status: true, block: block }
	}
	catch (e) {
		return {
			status: false,
			message: `blocksCollection: Caught Error --> ${e}`
		}
	}
}


/******************* [EXISTANCE] *******************/
const c_existance = async (block_id) => {
	if (mongoose.isValidObjectId(block_id)) {
		try {	
			const block = await BlockModel.findOne({ _id: block_id })

			if (block) {
				return {
					status: true,
					existance: true,
					block: block,
				}
			}
			else {
				return {
					status: true,
					existance: false,
					block: block,
				}
			}
		}
		catch (e) {
			return {
				status: false,
				message: `blocksCollection: Caught Error --> ${e}`
			}
		}
	}
	else {
		return {
			status: false,
			message: 'blocksCollection: Invalid block_id'
		}
	}
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
					ownership: true,
					block: block,
				}
			}
			else {
				return {
					status: true,
					ownership: false,
					block: block,
				}
			}
		}
		catch (e) {
			return {
				status: false,
				message: `blocksCollection: Caught Error --> ${e}`,
			}
		}
	}
	else {
		return {
			status: false,
			message: 'blocksCollection: Invalid block_id',
		}
	}
}


/******************* [COUNT] *******************/
const c_countAll = async (cat_id) => {
	try {
		const count = await BlockModel.countDocuments({ cat_id: cat_id })

		return { status: true, count: count }
	}
	catch (e) {
		return {
			status: false,
			message: `blocksCollection: Caught Error --> ${e}`,
		}
	}
}


// [EXPORT] //
module.exports = {
	c_create,
	c_readAll,
	c_read,
	c_incrementLike,
	c_decrementLike,
	c_existance,
	c_ownership,
	c_countAll,
}
