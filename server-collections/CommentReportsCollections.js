/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENTS REPORTS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongodb = require('mongodb')
require('dotenv').config()


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
			const reports = await loadReportsCollection()
			await reports.insertOne({
				createdAt: new Date(),
				block_id: new mongodb.ObjectID(req.body.block_id),
				comment_id: new mongodb.ObjectID(req.params._id),
				user_id: new mongodb.ObjectID(req.decoded._id),
				type: req.body.reportType,
			})
			
			return
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
		let validId = mongodb.ObjectID.isValid(req.params._id)

		if (validId) {
			try {
				const reports = await loadReportsCollection()
				await reports.deleteOne(
					{ _id: new mongodb.ObjectID(req.params._id) }
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
	// Verify that User is not Double Inserting //
	static async existance(req) {
		const validId = mongodb.ObjectID.isValid(req.params._id)

		if (validId) {
			try {
				const reports = await loadReportsCollection()
				const returnedData = await reports.findOne({	
					comment_id: new mongodb.ObjectID(req.params._id),
					user_id: new mongodb.ObjectID(req.decoded._id),
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