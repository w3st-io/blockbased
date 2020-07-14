/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENTS REPORTS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongodb = require('mongodb')
const mongoose = require('mongoose')
require('dotenv').config()


// [REQUIRE] Personal //
const BlockModel = require('../models/CommentReportModel')


// [LOAD COLLECTION] reports //
async function loadReportsCollection() {
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'db_name'
	const c_name = 'commentReports'
	
	const client = await mongodb.MongoClient.connect(
		uri,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)

	return client.db(db_name).collection(c_name)
}


class CommentReportsCollection {
	/******************* [CRRUD] *******************/
	// [CREATE] //
	static async create(req) {
		try {
			const formData = new BlockModel({
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
		catch(e) { return `Caught Error: ${e}` }
	}


	// [READ ALL] //
	static async readAll(req) {
		try {
			const reports = await loadReportsCollection()
			const returnedData = await reports.find().toArray()

			return returnedData
		}
		catch (e) { return `Caught Error: ${e}` }
	}


	// [DELETE] Single Report //
	static async delete(req) {
		let validId = mongoose.isValidObjectId(req.params._id)

		if (validId) {
			try {
				const reports = await loadReportsCollection()
				await reports.deleteOne(
					{ _id: mongoose.Types.ObjectId(req.params._id) }
				)

				return
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Block ID.' }
	}


	// [DELETE ALL] //
	static async deleteAll(req) {
		try {
			const reports = await loadReportsCollection()
			await reports.deleteMany()

			return
		}
		catch(e) { return `Caught Error: ${e}` }
	}

	/******************* [EXISTANCE] *******************/
	// Verify that User is not Double Reporting //
	static async existance(req) {
		const validId = mongoose.isValidObjectId(req.params._id)

		if (validId) {
			try {
				const reports = await loadReportsCollection()
				const returnedData = await reports.findOne({	
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