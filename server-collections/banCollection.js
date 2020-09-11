/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% BAN COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const BanModel = require('../server-models/BanModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, hours) => {
	// [EXISTANCE] //
	const existance = await c_existance(user_id)

	if (!existance.status || existance.existance) {
		return {
			executed: true,
			status: false,
			message: existance.message
		}
	}

	try {
		let banTime = new Date()
		banTime.setHours(banTime.getHours() + hours)

		const createdBan = await new BanModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			bannedTill: banTime,
		}).save()

		return {
			executed: true,
			status: true,
			createdBan: createdBan,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `banCollection: Error --> ${err}`,
		}
	}
}


// [DELETE] //
const c_delete = async (user_id) => {
	try {
		const deletedBans = await BanModel.deleteMany({ user: user_id })

		return {
			executed: true,
			status: true,
			deletedBans: deletedBans,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `banCollection: Error --> ${err}`,
		}
	}
}


/******************* [EXISTANCE] *******************/
// [EXISTANCE] //
const c_existance = async (user_id) => {
	if (!mongoose.isValidObjectId(user_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid user_id',
		}
	}

	try {
		const foundBan = await BanModel.findOne({ user: user_id })

		if (!foundBan) {
			return {
				executed: true,
				status: true,
				message: 'Ban does NOT exists',
				existance: false,
			}
		}

		return {
			executed: true,
			status: true,
			message: 'Ban does exists',
			existance: true,
			foundBan: foundBan,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `banCollection: Error --> ${err}`,
		}
	}
}


// [EXPORT] //
module.exports = {
	c_create,
	c_delete,
	c_existance
}
