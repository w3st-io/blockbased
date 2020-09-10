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
			message: 'Invalid commentReport _id'
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
			checkedExistance: false,
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
				checkedExistance: true,
				existance: false,
				commentReport: commentReport,
			}
		}

		return {
			executed: true,
			status: true,
			checkedExistance: true,
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