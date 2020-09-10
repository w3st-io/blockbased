/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENTS REPORTS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const CommentReportModel = require('../server-models/CommentReportModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, comment_id, post_id, reportType) => {
	// [VALIDATE] user_id, comment_id, & post_id //
	if (
		!mongoose.isValidObjectId(user_id) ||
		!mongoose.isValidObjectId(post_id) ||
		!mongoose.isValidObjectId(comment_id)
	) {
		return {
			executed: true,
			status: false,
			message: 'Invalid id(s)',
		}
	}

	// [EXISTANCE] //
	const existance = await c_existance(user_id, comment_id)
	
	if (!existance.status || existance.existance) { return existance }
	
	try {
		const commentReport = await new CommentReportModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			comment: comment_id,
			post: post_id,
			reportType: reportType,
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
		const returned = await CommentReportModel.find()
			.populate('user')
			.populate('comment')
			.exec()

		return {
			executed: true,
			status: true,
			reports: returned
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
const c_delete = async (_id) => {
	if (!mongoose.isValidObjectId(_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid commentReport_id'
		}
	}

	try {
		const deletedCommentReport = await CommentReportModel.deleteOne({ _id: _id })

		return {
			executed: true,
			status: true,
			deletedCommentReport: deletedCommentReport,
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
	if (!mongoose.isValidObjectId(comment_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment_id',
		}
	}

	try {
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