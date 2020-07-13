/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% REPORTS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongodb = require('mongodb')
require('dotenv').config()


// [LOAD COLLECTION] reports //
async function loadReportsCollection() {
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'db_name'
	const c_name = 'notifications'

	const client = await mongodb.MongoClient.connect(
		uri,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)

	return client.db(db_name).collection(c_name)
}


class ReportsCollection {
	/******************* [CRRUD] *******************/
	// [READ ALL] //
	static async readAll(req) {
		const skip = parseInt(req.params.skip)
		const amount = parseInt(req.params.amount)
		
		try {
			const reports = await loadReportsCollection()
			const returnedData = await reports.find()
				.skip(skip)
				.limit(amount)
				.toArray()
	
			return returnedData
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	// [DELETE] //
	static async delete(req) {
		const validId = mongodb.ObjectID.isValid(req.params._id)

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


	/******************* [EXISTANCE + OWNERSHIP] *******************/
	// [EXISTANCE] //
	static async existance(_id) {
		if (mongodb.ObjectID.isValid(_id)) {
			try {
				const reports = await loadReportsCollection()
				const returnedData = await reports.findOne(
					{ _id: new mongodb.ObjectID(_id) }
				)
				
				if (returnedData) { return true }
				else { return false }
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Block ID.' }
	}


	// [OWNERSHIP] //
	static async ownership(req) {
		if (mongodb.ObjectID.isValid(req.params._id)) {
			try {
				const reports = await loadReportsCollection()
				const returnedData = await reports.findOne(
					{
						_id: new mongodb.ObjectID(req.params._id),
						user_id: new mongodb.ObjectID(req.decoded._id),
					}
				)

				if (returnedData) { return true }
				else { return false }
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Block ID.' }
	}


	/******************* [COUNT] *******************/
	static async count(req) {
		try {
			const reports = await loadReportsCollection()
			const count = await reports.countDocuments(
				{ user_id: new mongodb.ObjectID(req.decoded.user_id) }
			)

			return count
		}
		catch(e) { return `Caught Error: ${e}` }
	}
}


// [EXPORT] //
module.exports = ReportsCollection
