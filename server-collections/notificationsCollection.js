/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% NOTIFICATIONS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const NotificationModel = require('../server-models/NotificationModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, comment_id, type) => {
	const formData = new NotificationModel(
		{
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			comment: comment_id,
			type: type,
		}
	)
	
	try {
		const createdNotification = await formData.save()

		return {
			executed: true,
			status: true,
			createdNotification: createdNotification,
		}
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `notificationsCollection: Error --> ${e}`,
		}
	}
}

// [READ-ALL] //
const c_readAll = async (user_id) => {
	try {
		const notifications = await NotificationModel.find(
			{
				user: user_id,
				read: false
			}
		)
		.populate(
			{
				path: 'comment',
				populate: {
					path: 'user',
					select: 'username',
				}
			}
		)
		.populate(
			{
				path: 'comment',
				populate: {
					path: 'post',
					select: 'title',
				}
			}
		)
	
		return {
			executed: true,
			status: true,
			notifications: notifications
		}
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `nofiticationsCollection: Error --> ${e}`
		}
	}
}

// [DELETE-ALL] //
const c_deleteAll = async (comment_id) => {
	try {
		const deletedNotications = await NotificationModel.deleteMany(
			{ comment: comment_id }
		)

		return {
			executed: true,
			status: true,
			deletedNotications: deletedNotications,
		}
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `notificationsCollection: Error --> ${e}`,
		}
	}
}

// [DELETE] //
const c_delete = async () => {}


/******************* [MARK-READ-STATUS] *******************/
const c_markRead = async (_id) => {
	try {
		const notification = await NotificationModel.updateOne(
			{ _id: _id },
			{ read: true },
		)
			
		return {
			executed: true,
			status: true,
			markedRead: true,
			notification: notification
		}
	}	
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `notificationsCollection: Error --> ${e}`,
			markedRead: true,
		}
	}
}


// [EXPORT] //
module.exports = {
	c_create,
	c_readAll,
	c_deleteAll,
	c_delete,
	c_markRead,
}
