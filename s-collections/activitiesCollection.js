// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const ActivityModel = require('../s-models/ActivityModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async ({ user_id, type, post_id, created_user_id, created_post_id, created_comment_id }) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Invalid user_id',
			}
		}


		// [VALIDATE] type //
		if (!validator.isAscii(type)) {
			return {
				executed: true,
				status: false,
				message: 'adminsCollection: Invalid type (must be ASCII)'
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

		// [VALIDATE] created_user_id //
		if (!mongoose.isValidObjectId(created_user_id)) {
			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Invalid created_user_id',
			}
		}

		// [VALIDATE] created_post_id //
		if (!mongoose.isValidObjectId(created_post_id)) {
			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Invalid created_post_id',
			}
		}

		// [VALIDATE] created_comment_id //
		if (!mongoose.isValidObjectId(created_comment_id)) {
			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Invalid created_comment_id',
			}
		}

		const activity = await ActivityModel({
			_id: mongoose.Types.ObjectId(),
			type: type,
			user: user_id,
			post: post_id,
			created_user: created_user_id,
			created_post: created_post_id,
			created_comment: created_comment_id,
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


/******************* [OTHER-CRUD] *******************/
// [READ-ALL] Sort //
const c_readSorted = async ({ sort = 0, limit, skip }) => {
	try {
		// [SANITIZE] //
		sort = parseInt(sort)
		limit = parseInt(limit)
		skip = parseInt(skip)

		// [VALIDATE] sort //
		if (!Number.isInteger(sort)) {
			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Invalid sort',
			}
		}

		// [VALIDATE] limit //
		if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Invalid limit',
			}
		}

		// [VALIDATE] skip //
		if (!Number.isInteger(skip)) {
			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Invalid skip',
			}
		}

		// Set Sort //
		if (sort == 0) { sort = {} }
		else if (sort == 1) { sort = { created_at: -1 } }
		else {
			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Unknown filter'
			}
		}

		const activities = await ActivityModel.find()
			.sort(sort)
			.limit(limit)
			.skip(skip)
			// user //
			.populate({
				path: 'user',
				select: 'username bio profile_img'
			})
			.populate({ path: 'post' })
			.populate({ path: 'comment' })
			.populate({ path: 'created_comment' })
			.populate({ path: 'created_user', select: 'username bio profile_img' })
			.populate({ path: 'created_post' })
			.exec()

		return {
			executed: true,
			status: true,
			activities: activities,
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


// [READ-ALL] Sort //
const c_readByUserSorted = async ({ user_id, sort = 0, limit, skip }) => {
	try {
		// [SANITIZE] //
		sort = parseInt(sort)
		limit = parseInt(limit)
		skip = parseInt(skip)

		// [VALIDATE] sort //
		if (!Number.isInteger(sort)) {
			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Invalid sort',
			}
		}

		// [VALIDATE] limit //
		if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Invalid limit',
			}
		}

		// [VALIDATE] skip //
		if (!Number.isInteger(skip)) {
			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Invalid skip',
			}
		}

		// Set Sort //
		if (sort == 0) { sort = {} }
		else if (sort == 1) { sort = { created_at: -1 } }
		else {
			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Unknown filter'
			}
		}
		
		const activities = await ActivityModel.find({ user: user_id })
			.sort(sort)
			.limit(limit)
			.skip(skip)
			.populate({ path: 'user', select: 'username bio profile_img' })
			.populate({ path: 'post' })
			.populate({ path: 'comment' })
			.populate({ path: 'created_comment' })
			.populate({ path: 'created_user', select: 'username bio profile_img' })
			.populate({ path: 'created_post' })
			.exec()

		return {
			executed: true,
			status: true,
			activities: activities,
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


// [DELETE] User Activity //
const c_deleteUserActivityByUser = async (user_id) => {
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


/******************* [COUNT] *******************/
const c_count = async () => {
	try {
		const count = await ActivityModel.countDocuments()

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
			message: `activitiesCollection: Error --> ${err}`,
		}
	}
}


const c_countByUser = async (user_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {

			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Invalid user_id',
			}
		}

		const count = await ActivityModel.countDocuments({ user: user_id })
		
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
			message: `activitiesCollection: Error --> ${err}`,
		}
	}
}


const c_countByUserTimeFrame = async (user_id, timePointA, timePointB) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {

			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Invalid user_id',
			}
		}

		// [VALIDATE] timePointA //
		if (!(new Date(timePointA)).getTime() > 0) {

			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Invalid timePointA',
			}
		}

		// [VALIDATE] timePointA //
		if (!(new Date(timePointB)).getTime() > 0) {

			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Invalid timePointA',
			}
		}

		const count = await ActivityModel.countDocuments({
			user: user_id,
			created_at: {
				$gte: timePointA,
				$lte: timePointB
			}
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
			message: `activitiesCollection: Error --> ${err}`,
		}
	}
}


const c_countTimeFrame = async (timePointA, timePointB) => {
	try {
		// [VALIDATE] timePointA //
		if (!(new Date(timePointA)).getTime() > 0) {

			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Invalid timePointA',
			}
		}

		// [VALIDATE] timePointA //
		if (!(new Date(timePointB)).getTime() > 0) {

			return {
				executed: true,
				status: false,
				message: 'activitiesCollection: Invalid timePointA',
			}
		}

		// [READ-ALL] timePointA < Tweets < timePointB //
		const count = await ActivityModel.countDocuments({
			created_at: {
				$gte: timePointA,
				$lte: timePointB
			}
		})

		return {
			executed: true,
			status: true,
			count: count,
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


module.exports = {
	c_create,
	c_readSorted,
	c_readByUserSorted,
	c_deleteUserActivityByUser,
	c_deletePostActivity,
	c_deleteCommentActivity,
	c_deleteCustom,
	c_count,
	c_countByUser,
	c_countByUserTimeFrame,
	c_countTimeFrame,
}