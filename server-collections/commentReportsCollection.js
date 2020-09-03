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
	const formData = new CommentReportModel({
		_id: mongoose.Types.ObjectId(),
		user: user_id,
		comment: comment_id,
		post: post_id,
		reportType: reportType,
	})
	
	try {
		const commentReport = await formData.save()

		return {
			executed: true,
			status: true,
			created: true,
			commentReport: commentReport,
		}
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `commentReportsCollection: Error --> ${e}`
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
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `commentReportsCollection: Error --> ${e}`
		}
	}
}


// [DELETE] Single Report //
const c_delete = async (commentReport_id) => {
	const validId = mongoose.isValidObjectId(commentReport_id)

	if (validId) {
		try {
			const deletedCommentReport = await CommentReportModel.deleteOne(
				{ _id: commentReport_id }
				)

			return {
				executed: true,
				status: true,
				deletedCommentReport: deletedCommentReport,
			}
		}
		catch (e) {
			return {
				executed: false,
				status: false,
				message: `commentReportsCollection: Error --> ${e}`
			}
		}
	}
	else {
		return {
			executed: true,
			status: false,
			message: 'Invalid commentReport_id'
		}
	}
}


/******************* [EXISTANCE] *******************/
// Verify that User is not Double Reporting //
const c_existance = async (user_id, comment_id) => {
	if (mongoose.isValidObjectId(comment_id)) {
		try {
			const commentReport = await CommentReportModel.findOne({	
				comment: comment_id,
				user: user_id,
			})

			if (commentReport) {
				return {
					executed: true,
					status: true,
					checkedExistance: true,
					existance: true,
					commentReport: commentReport,
				}
			}
			else {
				return {
					executed: true,
					status: true,
					checkedExistance: true,
					existance: false,
					commentReport: commentReport,
				}
			}
		}
		catch (e) {
			return {
				executed: false,
				status: false,
				message: `commentReportsCollection: Error --> ${e}`
			}
		}
	}
	else {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment_id',
			checkedExistance: false,
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