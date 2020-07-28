/**
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCKS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] //
const BlockModel = require('../server-models/BlockModel')


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
					{
						path: 'user',
						select: 'username email profileImg',
					}
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
					{
						path: 'user',
						select: 'username email profileImg',
					}
				)
				.exec()

			return returnedData
		}
		catch(e) { return { status: false, message: `Caught Error --> ${e}`, } }
	}


	// [READ] Single Block //
	static async read(block_id) {
		if (mongoose.isValidObjectId(block_id)) {
			try {
				const returnedData = await BlockModel.findById(block_id)
					.populate(
						{
							path: 'user',
							select: 'username email profileImg',
						}
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


	/******************* [LIKE SYSTEM] *******************/
	// [LIKE] //
	static async like(user_id, block_id) {
		const likeExistance = await this.likeExistance(user_id, block_id)

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


	// [LIKE-EXISTANCE] //
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
					message: 'Block Like does exists',
					existance: true,
				}
			}
			else {
				return {
					status: true,
					message: 'Block Like does NOT exists',
					existance: false,
				}
			}
		}
		catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
	}


		/******************* [FOLLOW SYSTEM] *******************/
	// [LIKE] //
	static async follow(user_id, block_id) {
		const followExistance = await this.followExistance(user_id, block_id)

		if (followExistance.status && !followExistance.existance) {
			try {
				await BlockModel.updateOne(
					{ _id: block_id },
					{ '$addToSet': { 'followers': user_id } }
				)
					
				return {
					status: true,
					message: 'Followed block',
					block_id: block_id,
					user_id: user_id,
				}
			}	
			catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
		}
		else { return { status: false, message: followExistance.message } }
	}


	// [UNLIKE] //
	static async unfollow(user_id, block_id) {
		const followExistance = await this.followExistance(user_id, block_id)

		if (followExistance.status && followExistance.existance) {
			try {
				await BlockModel.updateOne(
					{ _id: block_id },
					{ '$pull': { 'followers': user_id } }
				)

				return {
					status: true,
					message: 'Unfollowed block',
					block_id: block_id,
					user_id: user_id,
				}
			}
			catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
		}
		else { return { status: false, message: followExistance.message } }
	}


	// [FOLLOW-EXISTANCE] //
	static async followExistance(user_id, block_id) {
		try {	
			const returnedData = await BlockModel.findOne(
				{
					_id: block_id,
					followers: user_id
				}
			)

			if (returnedData) {
				return {
					status: true,
					message: 'Block follow does exists',
					existance: true,
				}
			}
			else {
				return {
					status: true,
					message: 'Block follow does NOT exists',
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
