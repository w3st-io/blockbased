/**
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCKS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongodb = require('mongodb')
require('dotenv').config()


// [LOAD COLLECTION] blocks //
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


class BlocksCollection {
	/******************* [CRRUD] *******************/
	// [CREATE] //
	static async create(req) {
		try {
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

			return
		}
		catch(e) { return `Caught Error: ${e}`	}
	}


	// [READ ALL] //
	static async readAllAll(req) {
		const skip = parseInt(req.params.skip)
		const amount = parseInt(req.params.amount)
		
		try {
			const blocks = await loadBlocksCollection()
			const returnedData = await blocks.find()
				.skip(skip)
				.limit(amount)
				.toArray()
	
			return returnedData
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	// [READ ALL] Within Cat //
	static async readAll(req) {
		const skip = parseInt(req.params.skip)
		const amount = parseInt(req.params.amount)

		try {
			const blocks = await loadBlocksCollection()
			const returnedData = await blocks.find(
				{ cat_id: req.params.cat_id }
			)
				.skip(skip)
				.limit(amount)
				.toArray()

			return returnedData
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	// [READ] Single Block //
	static async read(req) {
		const validId = mongodb.ObjectID.isValid(req.params._id)
	
		if (validId) {
			try {
				const blocks = await loadBlocksCollection()
				const returnedData = await blocks.findOne(
					{ _id: new mongodb.ObjectID(req.params._id) }
				)
				
				return returnedData
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Block ID.' }
	}


	// [DELETE] //
	static async delete(req) {
		const validId = mongodb.ObjectID.isValid(req.params._id)

		if (validId) {
			try {
				const blocks = await loadBlocksCollection()
				await blocks.deleteOne(
					{ _id: new mongodb.ObjectID(req.params._id) }
				)

				return
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Block ID.' }
	}


	/******************* [VOTE SYSTEM] *******************/
	static async pushVoter(req) {
		try {
			const blocks = await loadBlocksCollection()
			await blocks.updateOne(
				{ _id: new mongodb.ObjectID(req.params._id) },
				{ $push: { 
					voters: {
						user_id: req.decoded._id,
						email: req.decoded.email,
					}
				} },
				{ upsert: true }
			)

			return
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	static async pullVoter(req) {
			try {
				const blocks = await loadBlocksCollection()
				await blocks.updateOne(
					{ _id: new mongodb.ObjectID(req.params._id) },
					{ $pull: { voters: { user_id: req.decoded._id } } },
					{ upsert: true }
				)

				return
			}
			catch(e) { return `Caught Error: ${e}` }
	}

	static async voteExistance(req) { return true }

	// Check if User Voted For This Block
	static async checkForVote(req) { return }


	/******************* [EXISTANCE] *******************/
	static async existance(block_id) {
		if (mongodb.ObjectID.isValid(block_id)) {
			try {
				const blocks = await loadBlocksCollection()
				const returnedData = await blocks.findOne(
					{ _id: new mongodb.ObjectID(block_id) }
				)
				
				if (returnedData) { return true }
				else { return false }
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Block ID.' }
	}


	/******************* [OWNERSHIP] *******************/
	static async verifyOwnership(existance, req) {
		if (mongodb.ObjectID.isValid(req.params._id)) {
			try {
				const blocks = await loadBlocksCollection()
				const returnedData = await blocks.findOne({
					_id: new mongodb.ObjectID(req.params._id),
					user_id: req.decoded._id,
				})

				// If Existance True/False Check //
				if (existance) {
					if (returnedData) { return true }
					else { return false }
				}
				else if (existance) {
					if (returnedData) { return false }
					else { return true }
				}
				else { return false }
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Block ID.' }
	}


	/******************* [COUNT] *******************/
	static async count(req) {
		try {
			const blocks = await loadBlocksCollection()
			const count = await blocks.countDocuments(
				{ cat_id: req.params.cat_id }
			)

			return count
		}
		catch(e) { return `Caught Error: ${e}` }
	}
}


// [EXPORT] //
module.exports = BlocksCollection
