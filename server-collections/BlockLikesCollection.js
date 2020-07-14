/**
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCKS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongodb = require('mongodb')
require('dotenv').config()


// [LOAD COLLECTION] blockLikes //
async function loadBlockLikesCollection() {
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'db_name'
	const c_name = 'blockLikes'
	
	const client = await mongodb.MongoClient.connect(
		uri,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)

	return client.db(db_name).collection(c_name)
}


class BlockLikesCollection {
	/******************* [CRRUD] *******************/
	// [CREATE] //
	static async create(req) {
		try {
			const blockLikes = await loadBlockLikesCollection()
			await blockLikes.insertOne({
				createdAt: new Date(),
				block_id: mongoose.Types.ObjectId(req.params._id),
				user_id: mongoose.Types.ObjectId(req.decoded._id),
				email: req.decoded.email,
				username: req.decoded.username,
			})
			
			return
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	// [DELETE] //
	static async delete(req) {
		try {
			const blockLikes = await loadBlockLikesCollection()
			await blockLikes.deleteMany({
				block_id: mongoose.Types.ObjectId(req.params._id),
				user_id: mongoose.Types.ObjectId(req.decoded._id),
			})

			return
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	// [DELETE ALL] //
	static async deleteAll(req) {
		try {
			const blockLikes = await loadBlockLikesCollection()
			await blockLikes.deleteMany(
				{
					block_id: mongoose.Types.ObjectId(req.params.block_id)
				}
			)

			return
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	/******************* [EXISTANCE + OWNERSHIP] *******************/
	static async existance(block_id, user_id) {
		if (mongoose.isValidObjectId(block_id)) {
			try {
				const blockLikes = await loadBlockLikesCollection()
				const returnedData = await blockLikes.findOne(
					{
						block_id: mongoose.Types.ObjectId(block_id),
						user_id: mongoose.Types.ObjectId(user_id),
					}
				)
	
				if (returnedData) { return false }
				else { return true }
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Block ID.' }
	}
	

	static async ownership(req) {
		const blockLikes = await loadBlockLikesCollection()
		const returnedData = await blockLikes.findOne(
			{
				block_id: mongoose.Types.ObjectId(req.params.block_id),
				user_id: mongoose.Types.ObjectId(req.decoded._id),
			}
		)

		if (returnedData) { return true }
		else { return false }
	}
}


// [EXPORT] //
module.exports = BlockLikesCollection