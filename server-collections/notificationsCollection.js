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
	// [VALIDATE] user_id & comment_id //
	if (!mongoose.isValidObjectId(user_id) || !mongoose.isValidObjectId(comment_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid id(s)',
		}
	}

	try {
		// [SAVE] // 
		const notification = await new NotificationModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			comment: comment_id,
			type: type,
		}).save()

		return {
			executed: true,
			status: true,
			createdNotification: notification,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `notificationsCollection: Error --> ${err}`,
		}
	}
}

// [READ-ALL] //
const c_readAll = async (user_id) => {
	// [VALIDATE] user_id //
	if (!mongoose.isValidObjectId(user_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid id(s)',
		}
	}

	try {
		const notifications = await NotificationModel.find({
			user: user_id,
			read: false
		})
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
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `nofiticationsCollection: Error --> ${err}`
		}
	}
}

// [DELETE-ALL] //
const c_deleteAll = async (comment_id) => {
	// [VALIDATE] comment_id //
	if (!mongoose.isValidObjectId(comment_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid id(s)',
		}
	}

	try {
		const deletedNotications = await NotificationModel.deleteMany({
			comment: comment_id
		})

		return {
			executed: true,
			status: true,
			deletedNotications: deletedNotications,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `notificationsCollection: Error --> ${err}`,
		}
	}
}

// [DELETE] //
const c_delete = async () => {}


/******************* [MARK-READ-STATUS] *******************/
const c_markRead = async (_id) => {
	// [VALIDATE] _id //
	if (!mongoose.isValidObjectId(_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid notification _id',
		}
	}

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
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `notificationsCollection: Error --> ${err}`,
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
