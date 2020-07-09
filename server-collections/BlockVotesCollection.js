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
	/******************* [CRUD] *******************/
	// [CREATE] //
	static create() {
		return async (req, res, next) => {
			try {
				const blockVotes = await loadBlockVotesCollection()
				await blockVotes.insertOne({
					createdAt: new Date(),
					block_id: req.body.block_id,
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


	// [DELETE] //
	static delete() {
		return async (req, res, next) => {
			try {
				const blockVotes = await loadBlockVotesCollection()
				await blockVotes.deleteMany({
					block_id: req.params.block_id,
					user_id: req.decoded._id,
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


	// [DELETE ALL] //
	static deleteAll() {
		return async (req, res, next) => { 
			try {
				const blockVotes = await loadBlockVotesCollection()
				await blockVotes.deleteMany({
					block_id: req.params.block_id,
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
}


// [EXPORT] //
module.exports = BlockVotesCollection