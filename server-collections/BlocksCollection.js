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
let s_create = async (user_id, cat_id, title) => {
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
let s_readAllAll = async (skip, amount) => {
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
let s_readAll = async (cat_id, skip, amount) => {
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
let s_read = async (block_id) => {
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
let s_delete = async (block_id) => {
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
let s_like = async (user_id, block_id) => {
	const likeExistance = await s_likeExistance(user_id, block_id)

	if (likeExistance.status == true && likeExistance.existance == false) {
		try {
			await BlockModel.updateOne(
				{ _id: block_id },
				{ '$addToSet': { 'likers': user_id } }
			)
				
			return {
				status: true,
				message: 'Liked block',
				user_id: user_id,
				block_id: block_id,
			}
		}	
		catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
	}
	else { return { status: false, message: likeExistance.message } }
}


// [UNLIKE] //
let s_unlike = async (user_id, block_id) => {
	const likeExistance = await s_likeExistance(user_id, block_id)

	if (likeExistance.status == true && likeExistance.existance == true) {
		try {
			await BlockModel.updateOne(
				{ _id: block_id },
				{ '$pull': { 'likers': user_id } }
			)

			return {
				status: true,
				message: 'Unliked block',
				user_id: user_id,
				block_id: block_id,
			}
		}
		catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
	}
	else { return { status: false, message: likeExistance.message } }
}


// [LIKE-EXISTANCE] //
let s_likeExistance = async (user_id, block_id) => {
	try {	
		const returnedData = await BlockModel.findOne(
			{
				_id: block_id,
				likers: user_id,
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
let s_follow = async (user_id, block_id) => {
	const followExistance = await s_followExistance(user_id, block_id)

	if (followExistance.status && !followExistance.existance) {
		try {
			await BlockModel.updateOne(
				{ _id: block_id },
				{ '$addToSet': { 'followers': user_id } }
			)
				
			return {
				status: true,
				message: 'Followed block',
				user_id: user_id,
				block_id: block_id,
			}
		}	
		catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
	}
	else { return { status: false, message: followExistance.message } }
}


// [UNLIKE] //
let s_unfollow = async (user_id, block_id) => {
	const followExistance = await s_followExistance(user_id, block_id)

	if (followExistance.status && followExistance.existance) {
		try {
			await BlockModel.updateOne(
				{ _id: block_id },
				{ '$pull': { 'followers': user_id } }
			)

			return {
				status: true,
				message: 'Unfollowed block',
				user_id: user_id,
				block_id: block_id,
			}
		}
		catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
	}
	else { return { status: false, message: followExistance.message } }
}


// [FOLLOW-EXISTANCE] //
let s_followExistance = async (user_id, block_id) => {
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
let s_existance = async (block_id) => {
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
let s_ownership = async (user_id, block_id) => {
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
let s_count = async (cat_id) => {
	try { return await BlockModel.countDocuments({ cat_id: cat_id }) }
	catch(e) { return `Caught Error --> ${e}` }
}



// [EXPORT] //
module.exports = {
	s_create,
	s_readAllAll,
	s_readAll,
	s_read,
	s_delete,
	s_like,
	s_unlike,
	s_likeExistance,
	s_follow,
	s_unfollow,
	s_followExistance,
	s_existance,
	s_ownership,
	s_count,
}
