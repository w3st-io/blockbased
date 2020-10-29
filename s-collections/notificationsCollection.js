/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
 * %%% NOTIFICATIONS COLLECTION %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const NotificationModel = require('../s-models/NotificationModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, comment_id, type) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'notificationsCollection: Invalid user_id',
				updated: false,
			}
		}

		// [VALIDATE] comment_id //
		if (!mongoose.isValidObjectId(comment_id)) {
			return {
				executed: true,
				status: false,
				message: 'notificationsCollection: Invalid comment_id',
				updated: false,
			}
		}

		// [SAVE] // 
		const notification = await new NotificationModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			comment: comment_id,
			type,
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
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'notificationsCollection: Invalid user_id',
				updated: false,
			}
		}

		const notifications = await NotificationModel.find({ user: user_id })
			.sort({ createdAt: -1 })
			.populate({
				path: 'comment',
				populate: {
					path: 'user',
					select: 'username',
				}
			})
			.populate({
				path: 'comment',
				populate: {
					path: 'post',
					select: 'title',
				}
			})
	
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


/******************* [OTHER-CRUD] *******************/
// [READ-ALL] Unread //
const c_readAllUnread = async (user_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'notificationsCollection: Invalid user_id',
				updated: false,
			}
		}

		const notifications = await NotificationModel.find({
			user: user_id,
			read: false
		})
			.sort({ createdAt: -1 })
			.populate({
				path: 'comment',
				populate: {
					path: 'user',
					select: 'username',
				}
			})
			.populate({
				path: 'comment',
				populate: {
					path: 'post',
					select: 'title',
				}
			})
	
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


// [DELETE] Comment //
const c_deleteByComment = async (comment_id) => {
	try {
		// [VALIDATE] comment_id //
		if (!mongoose.isValidObjectId(comment_id)) {
			return {
				executed: true,
				status: false,
				message: 'notificationsCollection: Invalid comment_id',
			}
		}

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


// [DELETE] Custom //
const c_deleteCustom = async (filter) => {
	try {
		// [VALIDATE] filter //
		if (!filter || filter == {}) {
			return {
				executed: true,
				status: false,
				message: 'postFollowsCollection: No filter passed',
				updated: false,
			}
		}


		const deletedNotications = await NotificationModel.deleteMany(filter)

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


/******************* [MARK-READ-STATUS] *******************/
const c_markRead = async (notification_id) => {
	try {
		// [VALIDATE] notification_id //
		if (!mongoose.isValidObjectId(notification_id)) {
			return {
				executed: true,
				status: false,
				message: 'notificationsCollection: Invalid notification_id',
			}
		}

		const notification = await NotificationModel.updateOne(
			{ _id: notification_id },
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


const c_count = async (user_id) => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'NotificationsCollection: Invalid user_id'
			}
		}

		const count = await NotificationModel.countDocuments({ user: user_id })

		return {
			executed: true,
			status: true,
			count: count
		} 
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentsCollection: Error --> ${err}`
		}
	}
}


// [EXPORT] //
module.exports = {
	c_create,
	c_readAll,
	c_readAllUnread,
	c_deleteByComment,
	c_deleteCustom,
	c_markRead,
	c_count,
}
