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
	const c_name = 'reports'
	
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
	// [CREATE] //
	static create() {
		return async (req, res, next) => {
			try {
				const reports = await loadReportsCollection()
				await reports.insertOne({
					createdAt: new Date(),
					block_id: req.body.block_id,
					comment_id: req.body.comment_id,
					type: req.body.reportType,
					user_id: req.decoded._id,
					email: req.decoded.email,
					username: req.decoded.username,
				})
				
				next()
			}
			catch(e) {
				res.status(400).send({
					auth: true,
					message: `Caught Error: ${e}`,
				})
			}

		}
	}


	// [READ ALL] //
	static readAll() {
		return async (req, res, next) => {
			try {
				const reports = await loadReportsCollection()
				const retrievedData = await reports.find()
				.toArray()

				// If Data Retrieved Store //
				if (retrievedData) { req.retrievedData = retrievedData }
				else { req.retrievedData = '' }

				next()
			}
			catch (e) {
				res.status(400).send({
					auth: true,
					message: `Caught Error: ${e}`,
				})
			}
		}
	}


	// [DELETE] Single Report //
	static delete() {
		return async (req, res, next) => {
			let validId = mongodb.ObjectID.isValid(req.params._id)

			if (validId) {
				try {
					const reports = await loadReportsCollection()
					await reports.deleteOne(
						{ _id: new mongodb.ObjectID(req.params._id) }
					)

					next()
				}
				catch(e) {
					res.status(400).send({
						auth: true,
						message: `Caught Error: ${e}`,
					})
				}
			}
			else {
				res.status(400).send({
					auth: true,
					message: 'Invalid Block ID.'
				})
			}
		}
	}


	// [DELETE ALL] //
	static deleteAll() {
		return async (req, res, next) => { 
			try {
				const reports = await loadReportsCollection()
				await reports.deleteMany()

				next()
			}
			catch(e) {
				res.status(400).send({
					auth: true,
					message: `Caught Error: ${e}`,
				})
			}
		}
	}
}


// [EXPORT] //
module.exports = ReportsCollection