// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')


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

		// [VALIDATE] type //
		if (!validator.isAscii(type)) {
			return {
				executed: true,
				status: false,
				message: 'notificationsCollection: Invalid type',
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


/******************* [OTHER-CRUD] *******************/
// [READ-ALL] //
const c_readByUserSorted = async (user_id, sort, limit, skip) => {
	try {
		// [SANTIZE] //
		sort = parseInt(sort)
		limit = parseInt(limit)
		skip = parseInt(skip)

		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'notificationsCollection: Invalid user_id',
				updated: false,
			}
		}

		// [VALIDATE] sort //
		if (!Number.isInteger(sort)) {
			return {
				executed: true,
				status: false,
				message: 'notificationsCollection: Invalid sort',
				updated: false,
			}
		}

		// [VALIDATE] limit //
		if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
			return {
				executed: true,
				status: false,
				message: 'notificationsCollection: Invalid limit',
				updated: false,
			}
		}

		// [VALIDATE] skip //
		if (!Number.isInteger(skip)) {
			return {
				executed: true,
				status: false,
				message: 'notificationsCollection: Invalid skip',
				updated: false,
			}
		}

		if (sort == 0) { sort = {} }
		else { sort = { created_at: -1 } }

		const notifications = await NotificationModel.find({ user: user_id })
			.sort(sort)
			.limit(limit)
			.skip(skip)
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
			.exec()
	
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


// [READ-ALL] Sort Unread //
const c_readByUserSortedUnread = async (user_id, sort, limit, skip) => {
	try {
		// [SANTIZE] //
		sort = parseInt(sort)
		limit = parseInt(limit)
		skip = parseInt(skip)

		// [VALIDATE] sort //
		if (!Number.isInteger(sort)) {
			return {
				executed: true,
				status: false,
				message: 'notificationsCollection: Invalid sort',
				updated: false,
			}
		}

		// [VALIDATE] limit //
		if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
			return {
				executed: true,
				status: false,
				message: 'notificationsCollection: Invalid limit',
				updated: false,
			}
		}

		// [VALIDATE] skip //
		if (!Number.isInteger(skip)) {
			return {
				executed: true,
				status: false,
				message: 'notificationsCollection: Invalid skip',
				updated: false,
			}
		}

		if (sort == 0) { sort = {} }
		else { sort = { created_at: -1 } }

		const notifications = await NotificationModel.find({
			user: user_id,
			read: false,
		})
			.sort(sort)
			.limit(limit)
			.skip(skip)
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
			.exec()
	
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


const c_countUnread = async (user_id) => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'NotificationsCollection: Invalid user_id'
			}
		}

		const count = await NotificationModel.countDocuments({
			user: user_id,
			read: false,
		})

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


module.exports = {
	c_create,
	c_readByUserSorted,
	c_readByUserSortedUnread,
	c_deleteByComment,
	c_deleteCustom,
	c_markRead,
	c_count,
	c_countUnread,
}
