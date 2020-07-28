/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% NOTIFICATIONS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const NotificationModel = require('../server-models/NotificationModel')


class NotificationsCollection {
	/******************* [CRUD] *******************/
	// [CREATE] //
	static async create(user_id, comment_id, type) {
		const formData = new NotificationModel(
			{
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				comment: comment_id,
				type: type,
			}
		)
		
		try {
			await formData.save()

			return {
				status: true,
				message: 'Created notification',
				user: user_id,
				comment: comment_id,
			}
		}
		catch(e) {
			return {
				status: false,
				message: `Caught Error --> ${e}`,
				user: user_id,
				comment: comment_id,
			}
		}
	}
	

	// [READ-ALL] //
	static async readAll(user_id) {
		return await NotificationModel.find(
			{
				user: user_id
			}
		)
		.populate(
			{
				path : 'comment',
				populate : {
					path : 'user',
					select: 'username',
				}
			}
		)
	}


	// [DELETE] //
	static async delete() {}


	/******************* [EXISTANCE + OWNERSHIP] *******************/
	// [EXISTANCE] //
	static async existance() {}


	// [OWNERSHIP] //
	static async ownership() {}


	/******************* [COUNT] *******************/
	static async count() {}
}


// [EXPORT] //
module.exports = NotificationsCollection
