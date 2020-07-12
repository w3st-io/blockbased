/**
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCKS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongodb = require('mongodb')
require('dotenv').config()


// [LOAD COLLECTION] blockVotes //
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


class BlockVotesCollection {
	/******************* [CRRUD] *******************/
	// [CREATE] //
	static async create(req) {
		try {
			const blockVotes = await loadBlockVotesCollection()
			await blockVotes.insertOne({
				createdAt: new Date(),
				block_id: req.params._id,
				user_id: req.decoded._id,
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
				const blockVotes = await loadBlockVotesCollection()
				await blockVotes.deleteMany({
					block_id: req.params._id,
					user_id: req.decoded._id,
				})

				return
			}
			catch(e) { return `Caught Error: ${e}` }
	}


	// [DELETE ALL] //
	static async deleteAll() {
		try {
			const blockVotes = await loadBlockVotesCollection()
			await blockVotes.deleteMany({ block_id: req.params.block_id, })

			return
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	/******************* [EXISTANCE] *******************/
	static async existance(block_id, user_id, checkExistance) {
		if (mongodb.ObjectID.isValid(block_id)) {
			try {
				const commentVotes = await Collections.loadCommentVotesCollection()
				const returnedData = await commentVotes.findOne({
					block_id: block_id,
					user_id: user_id,
				})
	
				// If Existance True/False Check //
				if (checkExistance) {
					if (returnedData) { return true }
					else { return false }
				}
				else if (!checkExistance) {
					if (returnedData) { return false }
					else { return true }
				}
				else { return false }
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Block ID.' }
	}
	

	/******************* [OWNERSHIP] *******************/
	static async verifyOwnership(req) {
		const blockVotes = await loadBlockVotesCollection()
		const returnedData = await blockVotes.findOne(
			{
				block_id: req.params.block_id,
				user_id: req.decoded._id,
			}
		)

		if (returnedData) { return true }
		else { return false }
	}
}


// [EXPORT] //
module.exports = BlockVotesCollection