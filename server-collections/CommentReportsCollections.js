/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENTS REPORTS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const CommentReportModel = require('../models/CommentReportModel')


class CommentReportsCollection {
	/******************* [CRRUD] *******************/
	// [CREATE] //
	static async create(req) {
		const formData = new CommentReportModel({
			_id: mongoose.Types.ObjectId(),
			block_id: mongoose.Types.ObjectId(req.body.block_id),
			user_id: mongoose.Types.ObjectId(req.decoded._id),
			comment: mongoose.Types.ObjectId(req.params._id),
			reportType: req.body.reportType,
		})
		
		try { await formData.save() }
		catch(e) { return `Caught Error: ${e}` }
		
		return 'Created comment report.'
	}


	// [READ-ALL] //
	static async readAll(req) {
		try {
			const returnedData = await CommentReportModel.find()
				.toArray()

			return returnedData
		}
		catch (e) { return `Caught Error: ${e}` }
	}


	// [DELETE] Single Report //
	static async delete(req) {
		let validId = mongoose.isValidObjectId(req.params._id)

		if (validId) {
			try {
				await CommentReportModel.deleteOne(
					{ _id: mongoose.Types.ObjectId(req.params._id) }
				)
			}
			catch(e) { return `Caught Error: ${e}` }

			return 'Deleted report'
		}
		else { return 'Invalid Block ID.' }
	}


	// [DELETE-ALL-ALL] //
	static async deleteAllAll(req) {
		try { await CommentReportModel.deleteMany() }
		catch(e) { return `Caught Error: ${e}` }

		return 'Deleted all comment reports.'
	}

	
	/******************* [EXISTANCE] *******************/
	// Verify that User is not Double Reporting //
	static async existance(req) {
		const validId = mongoose.isValidObjectId(req.params._id)

		if (validId) {
			try {
				const returnedData = await CommentReportModel.findOne({	
					comment_id: mongoose.Types.ObjectId(req.params._id),
					user: mongoose.Types.ObjectId(req.decoded._id),
				})

				if (returnedData) { return true }
				else { return false }
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return'Invalid Block ID.' }
	}
}


// [EXPORT] //
module.exports = CommentReportsCollection