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
	console.log('Current Time:', new Date())
	const existance = await c_existance(user_id)

	if (existance.status && !existance.existance) {
		// Calculate ban time by adding hours to current time //
		let banTime = new Date()
		banTime.setHours(banTime.getHours() + hours)
		
		const formData = new BanModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			bannedTill: banTime,
		})

		try {
			const createdBan = await formData.save()

			return {
				status: true,
				createdBan: createdBan,
			}
		}
		catch (e) {
			return {
				status: false,
				message: `banCollection: Caught Error --> ${e}`,
			}
		}
	}
	else { return existance }
}

// [DELETE] //
const c_delete = async (user_id) => {
	try {
		const deletedBans = await BanModel.deleteMany({ user: user_id })

		return {
			status: true,
			deletedBans: deletedBans,
		}
	}
	catch (e) {
		return {
			status: false,
			message: `banCollection: Caught Error --> ${e}`,
		}
	}
}


/******************* [EXISTANCE] *******************/
// [EXISTANCE] //
const c_existance = async (user_id) => {
	if (mongoose.isValidObjectId(user_id)) {
		try {
			const foundBan = await BanModel.findOne({ user: user_id })

			if (foundBan) {
				return {
					status: true,
					message: 'Ban does exists',
					existance: true,
					foundBan: foundBan,
				}
			}
			else {
				return {
					status: true,
					message: 'Ban does NOT exists',
					existance: false,
				}
			}
		}
		catch (e) {
			return {
				status: false,
				message: `banCollection: Caught Error --> ${e}`,
			}
		}
	}
	else {
		return {
			status: false,
			message: 'banCollection: Invalid user_id',
		}
	}
}


// [EXPORT] //
module.exports = {
	c_create,
	c_delete,
	c_existance
}
