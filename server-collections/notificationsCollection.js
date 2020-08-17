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
			status: true,
			message: 'Created notification',
			createdNotification: createdNotification,
		}
	}
	catch(e) {
		return {
			status: false,
			message: `notificationsCollection: Caught Error --> ${e}`,
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
					path: 'block',
					select: 'title',
				}
			}
		)
	
		return { status: true, notifications: notifications }
	}
	catch(e) {
		return {
			status: false,
			message: `nofiticationsCollection: Caught Error --> ${e}`
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
			status: true,
			message: 'Deleted All Notifications for this comment',
			deletedNotications: deletedNotications,
		}
	}
	catch(e) {
		return {
			status: false,
			message: `notificationsCollection: Caught Error --> ${e}`,
		}
	}
}

// [DELETE] //
const c_delete = async () => {}


/******************* [MARK-READ-STATUS] *******************/
const c_markRead = async (notification_id) => {
	try {
		const notification = await NotificationModel.updateOne(
			{ _id: notification_id },
			{ read: true },
		)
			
		return {
			status: true,
			message: 'Marked read',
			notification: notification
		}
	}	
	catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
}


// [EXPORT] //
module.exports = {
	c_create,
	c_readAll,
	c_deleteAll,
	c_delete,
	c_markRead,
}
