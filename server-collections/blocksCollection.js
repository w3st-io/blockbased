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
			user: user_id,
		}
	}
	catch(e) {
		return {
			status: false,
			message: `Caught Error --> ${e}`,
			user: user_id,
			cat_id: cat_id,
			title: title,
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
	catch(e) { return { status: false, message: `Caught Error --> ${e}`, } }
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
		catch(e) {
			return { status: false, message: `blocksCollection: Caught Error --> ${e}` }
		}
	}
	else {
		return {
			status: false,
			message: 'Invalid Block ID',
			block_id: block_id,
		}
	}
}


/******************* [EXISTANCE + OWNERSHIP] *******************/
// [EXISTANCE] //
const c_existance = async (block_id) => {
	if (mongoose.isValidObjectId(block_id)) {
		try {	
			const returnedData = await BlockModel.findOne({ _id: block_id })

			if (returnedData) {
				return {
					status: true,
					message: 'Block does exist',
					existance: true,
					block_id: block_id,
				}
			}
			else {
				return {
					status: true,
					message: 'Block does NOT exist',
					existance: false,
					block_id: block_id,
				}
			}
		}
		catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
	}
	else { return { status: false, message: 'Invalid Block ID' } }
}

// [OWNERSHIP] //
const c_ownership = async (user_id, block_id) => {
	if (mongoose.isValidObjectId(block_id)) {
		try {	
			const returnedData = await BlockModel.findOne(
				{
					user: user_id,
					_id: block_id,
				}
			)

			if (returnedData) {
				return {
					status: true,
					message: 'You own this',
					ownership: true,
				}
			}
			else {
				return {
					status: true,
					message: 'You dont own this',
					ownership: false,
				}
			}
		}
		catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
	}
	else { { return { status: false, message: 'Invalid Block ID' } } }
}


/******************* [COUNT] *******************/
const c_count = async (cat_id) => {
	try { return await BlockModel.countDocuments({ cat_id: cat_id }) }
	catch(e) { return `Caught Error --> ${e}` }
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
