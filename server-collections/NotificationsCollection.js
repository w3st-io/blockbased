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
const s_create = async (user_id, comment_id, type) => {
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
const s_readAll = async (user_id) => {
	return await NotificationModel.find(
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
}


// [DELETE-ALL] //
const s_deleteAll = async (comment_id) => {
	try {
		await NotificationModel.deleteMany({ comment: comment_id })

		return {
			status: true,
			message: 'Deleted All Notifications for this comment',
			comment: comment_id,
		}
	}
	catch(e) {
		return {
			status: false,
			message: `Caught Error --> ${e}`,
			comment: comment_id,
		}
	}
}


// [DELETE] //
const s_delete = async () => {}


/******************* [MARK-READ-STATUS] *******************/
const s_markRead = async (user_id, notification_id) => {
	try {
		await NotificationModel.updateOne(
			{ _id: notification_id },
			{ read: true },
		)
			
		return {
			status: true,
			message: 'Marked read',
			user_id: user_id,
			notification_id: notification_id,
		}
	}	
	catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
}


// [EXPORT] //
module.exports = {
	s_create,
	s_readAll,
	s_deleteAll,
	s_delete,
	s_markRead,
}