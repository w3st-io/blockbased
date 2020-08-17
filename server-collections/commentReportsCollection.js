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
const c_create = async (user_id, comment_id, block_id, reportType) => {
	const formData = new CommentReportModel({
		_id: mongoose.Types.ObjectId(),
		user: user_id,
		comment: comment_id,
		block: block_id,
		reportType: reportType,
	})
	
	try {
		const commentReport = await formData.save()

		return {
			status: true,
			message: 'Created comment report',
			created: true,
			commentReport: commentReport,
		}
	}
	catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
}


// [READ-ALL] //
const c_readAll = async () => {
	try {
		const returnedData = await CommentReportModel.find()
			.populate('user')
			.populate('comment')
			.exec()

		return { status: true, reports: returnedData }
	}
	catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
}


// [DELETE] Single Report //
const c_delete = async (commentReport_id) => {
	let validId = mongoose.isValidObjectId(commentReport_id)

	if (validId) {
		try {
			const deletedCommentReport = await CommentReportModel.deleteOne(
				{ _id: commentReport_id }
				)

			return {
				status: true,
				message: 'Deleted report',
				deletedCommentReport: deletedCommentReport,
			}
		}
		catch(e) {
			return {
				status: false,
				message: `commentReportsCollection: Caught Error --> ${e}`
			}
		}
	}
	else { return { status: false, message: 'Invalid commentReport_id' } }
}


/******************* [EXISTANCE] *******************/
// Verify that User is not Double Reporting //
const c_existance = async (user_id, comment_id) => {
	const validId = mongoose.isValidObjectId(comment_id)

	if (validId) {
		try {
			const commentReport = await CommentReportModel.findOne({	
				comment: comment_id,
				user: user_id,
			})

			if (returnedData) {
				return {
					status: true,
					message: 'CommentReport does exist',
					existance: true,
					commentReport: commentReport,
				}
			}
			else {
				return {
					status: true,
					message: 'CommentReport does NOT exist',
					existance: false,
					commentReport: commentReport,
				}
			}
		}
		catch(e) {
			return {
				status: false,
				message: `commentReportsCollection: Caught Error --> ${e}`
			}
		}
	}
	else { return { status: false, message: 'Invalid comment_id' } }
}


// [EXPORT] //
module.exports = {
	c_create,
	c_readAll,
	c_delete,
	c_existance,
}