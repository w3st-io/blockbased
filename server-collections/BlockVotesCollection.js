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
	static create() {
		return async (req, res, next) => {
			try {
				const blockVotes = await loadBlockVotesCollection()
				await blockVotes.insertOne({
					createdAt: new Date(),
					block_id: req.params._id,
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
					block_id: req.params._id,
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


	/******************* [EXISTANCE] *******************/
	static existance(block_id, user_id, checkExistance) {
		if (mongodb.ObjectID.isValid(block_id)) {
			try {
				const commentVotes = await Collections.loadCommentVotesCollection()
				const retrievedData = await commentVotes.findOne({
					block_id: block_id,
					user_id: user_id,
				})
	
				// If Existance True/False Check //
				if (checkExistance) {
					if (retrievedData) { return true }
					else { return false }
				}
				else if (!checkExistance) {
					if (retrievedData) { return false }
					else { return true }
				}
				else { return false }
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Block ID.' }
	}
	

	/******************* [OWNERSHIP] *******************/
	static verifyOwnership() {
		return async (req, res, next) => {
			const blockVotes = await loadBlockVotesCollection()
			let returnedData = await blockVotes.findOne(
				{
					block_id: req.params.block_id,
					user_id: req.decoded._id,
				}
			)

			if (returnedData) { next() }
			else {
				return res.status(401).send({
					auth: false,
					error: 'Sorry man, you dont own this blockVote!'
				})
			}
		}
	}
}


// [EXPORT] //
module.exports = BlockVotesCollection