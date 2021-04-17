// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const CommentReportModel = require('../s-models/CommentReportModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, comment, post_id, reportType) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentReportsCollection: Invalid user_id',
			}
		}

		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentReportsCollection: Invalid post_id',
			}
		}

		// [VALIDATE] reportType //
		if (!validator.isAlpha(reportType)) {
			return {
				executed: true,
				status: false,
				message: 'commentReportsCollection: Invalid reportType',
			}
		}

		// [VALIDATE] comment //
		if (
			!mongoose.isValidObjectId(comment.user_id) &&
			!mongoose.isValidObjectId(comment.post_id) &&
			(
				!mongoose.isValidObjectId(comment.replyToComment) &&
				comment.replyToComment !== null
			)
		) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid comment',
			}
		}

		// [FORMAT] //
		reportType = reportType.toLowerCase()
	
		// [SAVE] //
		const commentReport = await new CommentReportModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			post: post_id,
			comment: comment,
			reportedUser: comment.user,
			reportType,
		}).save()

		return {
			executed: true,
			status: true,
			created: true,
			commentReport: commentReport,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentReportsCollection: Error --> ${err}`
		}
	}
}


// [DELETE] //
const c_delete = async (commentReport_id) => {
	try {
		// [VALIDATE] commentReport_id //
		if (!mongoose.isValidObjectId(commentReport_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentReportsCollection: Invalid commentReport_id'
			}
		}

		const commentReport = await CommentReportModel.deleteOne({
			_id: commentReport_id
		})

		return {
			executed: true,
			status: true,
			commentReport: commentReport,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentReportsCollection: Error --> ${err}`
		}
	}
}


/******************* [OTHER-CRUD] *******************/
const c_readUnhandled = async (sort, limit, skip) => {
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
				message: 'commentReportsCollection: Invalid sort',
			}
		}

		// [VALIDATE] limit //
		if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
			return {
				executed: true,
				status: false,
				message: 'commentReportsCollection: Invalid limit',
			}
		}

		// [VALIDATE] skip //
		if (!Number.isInteger(skip)) {
			return {
				executed: true,
				status: false,
				message: 'commentReportsCollection: Invalid skip',
			}
		}

		// Set Sort //
		if (sort == 0) { sort = {} }
		else if (sort == 1) { sort = { created_at: -1 } }
		else {
			return {
				executed: true,
				status: false,
				message: 'commentReportsCollection: Unknown filter'
			}
		}

		const commentReports = await CommentReportModel.find({ handled: false })
			.sort(sort)
			.limit(limit)
			.skip(skip)
			.populate({
				path: 'user',
				select: 'username email bio profile_img'
			})
			.exec()

		return {
			executed: true,
			status: true,
			commentReports: commentReports
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentReportsCollection: Error --> ${err}`
		}
	}
}


/******************* [MARK-HANDLED-STATUS] *******************/
const c_markHandled = async (commentReport_id) => {
	try {
		// [VALIDATE] commentReport_id //
		if (!mongoose.isValidObjectId(commentReport_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentReportsCollection: Invalid commentReport_id',
			}
		}

		const commentReport = await CommentReportModel.updateOne(
			{ _id: commentReport_id },
			{ handled: true },
		)
			
		return {
			executed: true,
			status: true,
			markedHandled: true,
			commentReport: commentReport
		}
	}	
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentReportsCollection: Error --> ${err}`,
			markedHandled: true,
		}
	}
}


/******************* [EXISTANCE] *******************/
// Verify that User is not Double Reporting //
const c_existanceByUserAndComment = async (user_id, comment_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentReportsCollection: Invalid user_id',
			}
		}

		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(comment_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentReportsCollection: Invalid comment_id',
			}
		}

		const commentReport = await CommentReportModel.findOne({	
			'comment._id': comment_id,
			user: user_id,
		})

		if (!commentReport) {
			return {
				executed: true,
				status: true,
				message: 'Comment report does NOT exists',
				existance: false,
			}
		}

		return {
			executed: true,
			status: true,
			message: 'Comment report exists',
			existance: true,
			commentReport: commentReport,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentReportsCollection: Error --> ${err}`
		}
	}
}


/******************* [COUNT] *******************/
const c_count = async () => {
	try {
		const count = await CommentReportModel.countDocuments()

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
			message: `commentReportsColelction: Error --> ${err}`
		}
	}
}


const c_countByReportedUser = async (user_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentReportsCollection: Invalid user_id',
			}
		}

		const count = await CommentReportModel.countDocuments({
			reportedUser: user_id
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
			message: `commentReportsColelction: Error --> ${err}`
		}
	}
}


const c_countHandledByReportedUser = async (user_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentReportsCollection: Invalid user_id',
			}
		}

		const count = await CommentReportModel.countDocuments({
			reportedUser: user_id,
			handled: true,
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
			message: `commentReportsColelction: Error --> ${err}`
		}
	}
}


const c_countUnhandledByReportedUser = async (user_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentReportsCollection: Invalid user_id',
			}
		}
		
		const count = await CommentReportModel.countDocuments({
			reportedUser: user_id,
			handled: false,
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
			message: `commentReportsColelction: Error --> ${err}`
		}
	}
}


module.exports = {
	c_create,
	c_delete,
	c_readUnhandled,
	c_markHandled,
	c_existanceByUserAndComment,
	c_count,
	c_countByReportedUser,
	c_countHandledByReportedUser,
	c_countUnhandledByReportedUser
}