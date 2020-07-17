/**
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCKS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')
require('dotenv').config()


// [REQUIRE] //
const BlockModel = require('../server-models/BlockModel')


// [MONGOOSE CONNECT] //
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})


class BlocksCollection {
	/******************* [CRUD] *******************/
	// [CREATE] //
	static async create(user_id, cat_id, title) {
		const formData = new BlockModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			cat_id: cat_id,
			title: title,
		})

		try { await formData.save() }
		catch(e) {
			return {
				status: false,
				user: user_id,
				cat_id: cat_id,
				title: title,
				message: `Caught Error --> ${e}`,
			}
		}

		return {
			status: true,
			user: user_id,
			cat_id: cat_id,
			title: title,
			message: 'Created block.',
		}
	}


	// [READ-ALL-ALL] //
	static async readAllAll(skip, amount) {
		const skip2 = parseInt(skip)
		const amount2 = parseInt(amount)

		try {
			const returnedData = await BlockModel.find()
				.skip(skip2)
				.limit(amount2)
				.populate(
					'user',
					'first_name last_name username email profileImg'
				)
				.exec()

			return returnedData
		}
		catch(e) {
			return {
				status: false,
				message: `Caught Error --> ${e}`,
			}
		}
	}


	// [READ-ALL] Within Cat //
	static async readAll(cat_id, skip, amount) {
		const skip2 = parseInt(skip)
		const amount2 = parseInt(amount)

		try {
			const returnedData = await BlockModel.find(
				{ cat_id: cat_id }
			)
				.skip(skip2)
				.limit(amount2)
				.populate(
					'user',
					'first_name last_name username email profileImg'
				)
				.exec()

			return returnedData
		}
		catch(e) {
			return {
				status: false,
				cat_id: cat_id,
				message: `Caught Error --> ${e}`,
			}
		}
	}


	// [READ] Single Block //
	static async read(block_id) {
		const validId = mongoose.isValidObjectId(block_id)
	
		if (validId) {
			try {
				const returnedData = await BlockModel.findById(block_id)
					.populate(
						'user',
						'first_name last_name username email profileImg'
					)
					.exec()
				
				return returnedData
			}
			catch(e) {
				return {
					status: false,
					block_id: block_id,
					message: `Caught Error --> ${e}`,
				}
			}
		}
		else {
			return {
				status: false,
				block_id: block_id,
				message: 'Invalid Block ID.',
			}
		}
	}


	// [DELETE] //
	static async delete(block_id) {
		const validId = mongoose.isValidObjectId(block_id)

		if (validId) {
			try {
				await BlockModel.findByIdAndDelete(
					block_id,
					function (e, block) {
						if (e) { return e }
						else { return `Deleted: ${block}` }
					}
				)
			}
			catch(e) {
				return {
					status: false,
					block_id: block_id,
					message: `Caught Error --> ${e}`,
				}
			}
		}
		else {
			return {
				status: false,
				block_id: block_id,
				message: 'Invalid Block ID.',
			}
		}
	}


	/******************* [VOTE SYSTEM] *******************/
	// [LIKE] //
	static async like(user_id, block_id) {
		try {
			await BlockModel.updateOne(
				{ _id: block_id },
				{ '$addToSet': { 'likers': user_id } }
			)

			return 'Liked block.'
		}
		catch(e) { return `Caught Error --> ${e}` }
	}


	// [UNLIKE] //
	static async unlike(user_id, block_id) {
		try {
			await BlockModel.updateOne(
				{ _id: block_id },
				{ '$pull': { 'likers': user_id } }
			)

			return 'Unliked block.'
		}
		catch(e) { return `Caught Error --> ${e}` }
	}


	// [LIKE-EXISTANCE] //
	static async likeExistance() { return true }


	/******************* [EXISTANCE + OWNERSHIP] *******************/
	// [EXISTANCE] //
	static async existance(block_id) {
		if (mongoose.isValidObjectId(block_id)) {
			try {	
				const returnedData = await BlockModel.findOne({ _id: block_id })

				if (returnedData) { return true }
				else { return false }
			}
			catch(e) { return `Caught Error --> ${e}` }
		}
		else { return 'Invalid Block ID.' }
	}


	// [OWNERSHIP] //
	static async ownership(user_id, block_id) {
		if (mongoose.isValidObjectId(block_id)) {
			try {	
				const returnedData = await BlockModel.findOne(
					{
						user: user_id,
						_id: block_id,
					}
				)

				if (returnedData) { return true }
				else { return false }
			}
			catch(e) { return `Caught Error --> ${e}` }
		}
		else { return 'Invalid Block ID.' }
	}


	/******************* [COUNT] *******************/
	static async count(cat_id) {
		try { return await BlockModel.countDocuments({ cat_id: cat_id }) }
		catch(e) { return `Caught Error --> ${e}` }
	}
}


// [EXPORT] //
module.exports = BlocksCollection
