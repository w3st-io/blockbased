/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT VOTES COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongodb = require('mongodb')
require('dotenv').config()


// [LOAD COLLECTION] commentVotes //
async function loadCommentVotesCollection() {
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'db_name'
	const c_name = 'commentVotes'
	
	const client = await mongodb.MongoClient.connect(
		uri,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)

	return client.db(db_name).collection(c_name)
}


class CommentVotesCollection {
	/******************* [CRRUD] *******************/
	// [CREATE] //
	static async create() {
		try {
			const commentVotes = await loadCommentVotesCollection()
			await commentVotes.insertOne({
				createdAt: new Date(),
				block_id: req.params.block_id,
				comment_id: req.params._id,
				user_id: req.decoded._id,
				email: req.decoded.email,
				username: req.decoded.username,
			})

			return
		}
		catch(e) { `Caught Error: ${e}` }
	}


	// [DELETE] //
	static async delete(req) {
		try {
			const commentVotes = await loadCommentVotesCollection()
			await commentVotes.deleteMany({
				comment_id: req.params._id,
				user_id: req.decoded._id,
			})
			
			return
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	// [DELETE ALL] //
	static async deleteAll(req) {
		try {
			const commentVotes = await loadCommentVotesCollection()
			await commentVotes.deleteMany(
				{ comment_id: req.params.comment_id, }
			)
			
			return
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	/******************* [EXISTANCE] *******************/
	static async existance(comment_id, user_id, checkExistance) {
		if (mongodb.ObjectID.isValid(comment_id)) {
			try {
				const commentVotes = await Collections.loadCommentVotesCollection()
				const returnedData = await commentVotes.findOne({
					comment_id: comment_id,
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
	static verifyOwnership() {
		return async (req, res, next) => {
			const commentVotes = await Collections.loadCommentVotesCollection()
			const returnedData = await commentVotes.findOne({
				comment_id: req.params.comment_id,
				user_id: req.decoded._id,
			})

			if (returnedData) { return true }
			else { return false }
		}
	}
}


// [EXPORT] //
module.exports = CommentVotesCollection