/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
 * %%% COMMENT LIKES COLLECTION %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const ActivityModel = require('../s-models/ActivityModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (type, user_id, post_id, comment_id) => {
	try {
		// [VALIDATE] type //
		if (!validator.isAscii(type)) {
			return {
				executed: true,
				status: false,
				message: 'adminsCollection: Invalid type (must be ASCII)'
			}
		}

		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid user_id',
			}
		}

		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid post_id',
			}
		}

		// [VALIDATE] comment_id //
		if (!mongoose.isValidObjectId(comment_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid comment_id',
			}
		}

		const activity = await ActivityModel({
			_id: mongoose.Types.ObjectId(),
			type: type,
			user: user_id,
			post: post_id,
			comment: comment_id,
		}).save()

		return {
			executed: true,
			status: true,
			activity: activity,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentsCollection: Error --> ${err}`,
		}
	}
}


// [CREATE] //
const c_deleteCommentActivity = async (comment_id) => {
	console.log('sdfsdfsdfS');
	try {
		// [VALIDATE] comment_id //
		if (!mongoose.isValidObjectId(comment_id)) {
			console.log('s', comment_id)

			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid comment_id',
			}
		}

		console.log('ss', comment_id)
		const activity = await ActivityModel.deleteMany({ comment: comment_id })

		return {
			executed: true,
			status: true,
			activity: activity,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `activitiesCollection: Error --> ${err}`,
		}
	}
}


// [EXPORT] //
module.exports = {
	c_create,
	c_deleteCommentActivity
}