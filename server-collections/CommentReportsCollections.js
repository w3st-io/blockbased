/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENTS REPORTS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const CommentReportModel = require('../server-models/CommentReportModel')


class CommentReportsCollection {
	/******************* [CRUD] *******************/
	// [CREATE] //
	static async create(user_id, comment_id, block_id, reportType) {
		const formData = new CommentReportModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			comment: comment_id,
			block: block_id,
			reportType: reportType,
		})
		
		try {
			await formData.save()

			return {
				status: true,
				message: 'Created comment report.',
				created: true
			}
		}
		catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
	}


	// [READ-ALL] //
	static async readAll() {
		try {
			const returnedData = await CommentReportModel.find()
				.populate('user')
				.populate('comment')
				.exec()

			return returnedData
		}
		catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
	}


	// [DELETE] Single Report //
	static async delete(commentReport_id) {
		let validId = mongoose.isValidObjectId(commentReport_id)

		if (validId) {
			try {
				await CommentReportModel.deleteOne({ _id: commentReport_id })

				return {
					status: true,
					message: 'Deleted report',
					commentReport_id: commentReport_id,
				}
			}
			catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
		}
		else { return { status: false, message: 'Invalid commentReport ID' } }
	}


	// [DELETE-ALL-ALL] //
	static async deleteAllAll() {
		try {
			await CommentReportModel.deleteMany()

			return {
				status: true,
				message: 'Deleted all comment reports',
			}
		}
		catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
	}

	
	/******************* [EXISTANCE] *******************/
	// Verify that User is not Double Reporting //
	static async existance(user_id, comment_id) {
		const validId = mongoose.isValidObjectId(comment_id)

		if (validId) {
			try {
				const returnedData = await CommentReportModel.findOne({	
					comment: comment_id,
					user: user_id,
				})

				if (returnedData) {
					return {
						status: true,
						message: 'CommentReport does exist',
						existance: true,
						comment_id: comment_id,
						user: user_id,
					}
				}
				else {
					return {
						status: true,
						message: 'CommentReport does NOT exist',
						existance: false,
						comment_id: comment_id,
						user: user_id,
					}
				}
			}
			catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
		}
		else { return { status: false, message: 'Invalid comment ID' } }
	}
}


// [EXPORT] //
module.exports = CommentReportsCollection