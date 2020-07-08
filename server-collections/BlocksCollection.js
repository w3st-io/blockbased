/**
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCKS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongodb = require('mongodb')
require('dotenv').config()


class blockCollections {
	/******************* [CRUD] *******************/
	// [CREATE] //
	static async create(req) {
		const blocks = await loadBlocksCollection()
		await blocks.insertOne({
			createdAt: new Date(),
			cat_id: req.body.cat_id,
			title: req.body.title,
			voters: [],
			followers: [],
			user_id: req.decoded._id,
			email: req.decoded.email,
			username: req.decoded.username,
		})
	}


	// [READ ALL] Within Cat //
	static async readAll(req) {
		let skip = parseInt(req.params.skip)
		let amountPerPage = parseInt(req.params.amountPerPage)
		
		const blocks = await loadBlocksCollection()
		const retrievedData = await blocks.find({ cat_id: req.params.cat_id })
			.skip(skip)
			.limit(amountPerPage)
			.toArray()

		return retrievedData
	}


	// [READ] Single Block //
	static async read(req) {
		const blocks = await loadBlocksCollection()
		const retrievedData = await blocks.findOne(
			{ _id: new mongodb.ObjectID(req.params.block_id) }
		)

		return retrievedData
	}

	// [DELETE] //
	static async delete(req) {
		/*const blocks = await loadBlocksCollection()
		await blocks.deleteOne({
			_id: new mongodb.ObjectID(req.params.block_id),
			user_id: req.decoded._id,
		})*/
	}


	/******************* [VOTE SYSTEM] *******************/
	static async pushVoter(req) {
		const blocks = await loadBlocksCollection()
		await blocks.updateOne(
			{ _id: new mongodb.ObjectID(req.params._id) },
			{ $push: { 
				voters: {
					user_id: req.decoded._id,
					email: req.decoded.email,
					username: req.decoded.username,
				} 
			} },
			{ upsert: true }
		)
	}


	static async pullVoter(req) {
		const blocks = await loadBlocksCollection()
		await blocks.updateOne(
			{ _id: new mongodb.ObjectID(req.params._id) },
			{ $pull: { voters: { user_id: req.decoded._id } } },
			{ upsert: true }
		)
	}


	/******************* [VALIDATE] *******************/
	// Check Block Exists //
	static async validate(req) {
		let existance = false

		const blocks = await loadBlocksCollection()
		const retrievedData = await blocks.findOne(
			{ _id: new mongodb.ObjectID(req.params._id) }
		)

		if (retrievedData) { existance = true }

		return existance
	}


	static async verifyOwnership(req) {
		existance = true

		return existance
	}


	/******************* [COUNT] *******************/
	static async count(req) {
		const blocks = await loadBlocksCollection()
		const count = await blocks.countDocuments(
			{ cat_id: req.params.cat_id }
		)
		
		return count
	}
}


// [LOAD COLLECTION] //
async function loadBlocksCollection() {
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'db_name'
	const c_name = 'blocks'

	const client = await mongodb.MongoClient.connect(
		uri,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)

	return client.db(db_name).collection(c_name)
}


// [EXPORT] //
module.exports = blockCollections
