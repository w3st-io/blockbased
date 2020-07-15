/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENTS REPORTS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')
require('dotenv').config()


// [REQUIRE] Personal //
const CommentReportModel = require('../server-models/CommentReportModel')


// [MONGOOSE CONNECT] //
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})


class CommentReportsCollection {
	/******************* [CRUD] *******************/
	// [CREATE] //
	static async create(req) {
		const formData = new CommentReportModel({
			_id: mongoose.Types.ObjectId(),
			block_id: req.body.block_id,
			reportType: req.body.reportType,
			comment: req.params._id,
			user: req.decoded._id,
		})
		
		try { await formData.save() }
		catch(e) { return `Caught Error: ${e}` }
		
		return 'Created comment report.'
	}


	// [READ-ALL] //
	static async readAll(req) {
		try { return await
			CommentReportModel.find()
				.populate('user')
				.populate('comment')
				.exec()
		}
		catch (e) { return `Caught Error: ${e}` }
	}


	// [DELETE] Single Report //
	static async delete(req) {
		let validId = mongoose.isValidObjectId(req.params._id)

		if (validId) {
			try {
				await CommentReportModel.deleteOne(
					{ _id: req.params._id }
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
					comment: req.params._id,
					user: req.decoded._id,
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