/**
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCKS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongodb = require('mongodb')
require('dotenv').config()


class BlockVotesCollection {
	/******************* [CRUD] *******************/
	// [CREATE] //
	static async create(req) {
		const blockVotes = await loadBlockVotesCollection()
		await blockVotes.insertOne({
			createdAt: new Date(),
			block_id: req.body.block_id,
			user_id: req.decoded._id,
			email: req.decoded.email,
			username: req.decoded.username,
		})
	}


	// [DELETE] //
	static async delete(req) {
		const blockVotes = await loadBlockVotesCollection()
		await blockVotes.deleteMany({
			block_id: req.params.block_id,
			user_id: req.decoded._id,
		})
	}
}
	
// [BLOCK-VOTES] //
async function loadBlockVotesCollection() {
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'db_name'
	const c_name = 'blockVotes'
	
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
module.exports = BlockVotesCollection