/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
 * %%% ACTIVITIES COLLECTION %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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
				message: 'activitiesCollection: Invalid user_id',
			}
		}

		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Invalid post_id',
			}
		}

		// [VALIDATE] comment_id //
		if (!mongoose.isValidObjectId(comment_id)) {
			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Invalid comment_id',
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
			message: `activitiesCollection: Error --> ${err}`,
		}
	}
}


/******************* [CRUD] *******************/
const c_deleteUserActivity = async (user_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Invalid user_id',
			}
		}

		const activity = await ActivityModel.deleteMany({ user: user_id })

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


// [DELETE] Post Activity //
const c_deletePostActivity = async (post_id) => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Invalid post_id',
			}
		}

		const activity = await ActivityModel.deleteMany({ post: post_id })

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


// [DELETE] Comment Activity //
const c_deleteCommentActivity = async (comment_id) => {
	try {
		// [VALIDATE] comment_id //
		if (!mongoose.isValidObjectId(comment_id)) {

			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Invalid comment_id',
			}
		}

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

		const activity = await ActivityModel.deleteMany(filter)

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
	c_deleteUserActivity,
	c_deletePostActivity,
	c_deleteCommentActivity,
	c_deleteCustom,
}