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

		try {
			await formData.save()

			return {
				status: true,
				message: 'Created block',
				user: user_id,
				cat_id: cat_id,
				title: title,
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
		catch(e) { return { status: false, message: `Caught Error --> ${e}`, } }
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
		catch(e) { return { status: false, message: `Caught Error --> ${e}`, } }
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


	// [DELETE] //
	static async delete(block_id) {
		const validId = mongoose.isValidObjectId(block_id)

		if (validId) {
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


	/******************* [LIKE SYSTEM] *******************/
	// [LIKE] //
	static async like(user_id, block_id) {
		const likeExistance = await this.likeExistance(user_id, block_id)

		console.log(likeExistance)

		if (likeExistance.status == true && likeExistance.existance == false) {
			try {
				await BlockModel.updateOne(
					{ _id: block_id },
					{ '$addToSet': { 'likers': user_id } }
				)
					
				return {
					status: true,
					message: 'Liked block',
					block_id: block_id,
					user_id: user_id,
				}
			}	
			catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
		}
		else { return { status: false, message: likeExistance.message } }
	}


	// [UNLIKE] //
	static async unlike(user_id, block_id) {
		const likeExistance = await this.likeExistance(user_id, block_id)

		if (likeExistance.status == true && likeExistance.existance == true) {
			try {
				await BlockModel.updateOne(
					{ _id: block_id },
					{ '$pull': { 'likers': user_id } }
				)

				return {
					status: true,
					message: 'Unliked block',
					block_id: block_id,
					user_id: user_id,
				}
			}
			catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
		}
		else { return { status: false, message: likeExistance.message } }
	}


	// [LIKE-EXISTANCE] // INCOMPLETE!
	static async likeExistance(user_id, block_id) {
		try {	
			const returnedData = await BlockModel.findOne(
				{
					_id: block_id,
					likers: user_id
				}
			)

			if (returnedData) {
				return {
					status: true,
					message: 'Comment Like does exists',
					existance: true,
				}
			}
			else {
				return {
					status: true,
					message: 'Comment Like does NOT exists',
					existance: false,
				}
			}
		}
		catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
	}


	/******************* [EXISTANCE + OWNERSHIP] *******************/
	// [EXISTANCE] //
	static async existance(block_id) {
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
	static async ownership(user_id, block_id) {
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
						message: 'You own this',
						ownership: false,
					}
				}
			}
			catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
		}
		else { { return { status: false, message: 'Invalid Block ID' } } }
	}


	/******************* [COUNT] *******************/
	static async count(cat_id) {
		try { return await BlockModel.countDocuments({ cat_id: cat_id }) }
		catch(e) { return `Caught Error --> ${e}` }
	}
}


// [EXPORT] //
module.exports = BlocksCollection
