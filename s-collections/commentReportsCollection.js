/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
 * %%% COMMENTS REPORTS COLLECTION %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const CommentReportModel = require('../s-models/CommentReportModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, comment_id, post_id, reportType) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentReportsCollection: Invalid user_id',
			}
		}

		// [VALIDATE] comment_id //
		if (!mongoose.isValidObjectId(comment_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentReportsCollection: Invalid comment_id',
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

		// [FORMAT] //
		reportType = reportType.toLowerCase()

		// [EXISTANCE] //
		const existance = await c_existance(user_id, comment_id)
		
		if (!existance.status || existance.existance) { return existance }
	
		// [SAVE] //
		const commentReport = await new CommentReportModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			comment: comment_id,
			post: post_id,
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


// [READ-ALL] //
const c_readAll = async () => {
	try {
		const commentReports = await CommentReportModel.find()
			.populate('user')
			.populate('comment')
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


// [DELETE] Single Report //
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


/******************* [EXISTANCE] *******************/
// Verify that User is not Double Reporting //
const c_existance = async (user_id, comment_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentReportsCollection: Invalid user_id',
			}
		}

		// [VALIDATE] comment_id //
		if (!mongoose.isValidObjectId(comment_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentReportsCollection: Invalid comment_id',
			}
		}

		const commentReport = await CommentReportModel.findOne({	
			comment: comment_id,
			user: user_id,
		})

		if (!commentReport) {
			return {
				executed: true,
				status: true,
				message: 'Comment report exists',
				existance: false,
			}
		}

		return {
			executed: true,
			status: true,
			message: 'Comment report does NOT exists',
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


// [EXPORT] //
module.exports = {
	c_create,
	c_readAll,
	c_delete,
	c_existance,
}