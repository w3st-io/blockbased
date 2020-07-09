/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT VOTES COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongodb = require('mongodb')
require('dotenv').config()


class CommentVotesCollection {
	/******************* [CRUD] *******************/
	// [CREATE] //
	static create() {
		return async (req, res, next) => { 
			const commentVotes = await loadCommentVotesCollection()
			await commentVotes.insertOne({
				createdAt: new Date(),
				block_id: req.params.block_id,
				comment_id: req.params._id,
				user_id: req.decoded._id,
				email: req.decoded.email,
				username: req.decoded.username,
			})
				.then( next() )
		}
	}


	// [DELETE] //
	static delete() {
		return async (req, res, next) => { 
			const commentVotes = await loadCommentVotesCollection()
			await commentVotes.deleteMany({
				comment_id: req.params.comment_id,
				user_id: req.decoded._id,
			})
				.then( next() )
		}
	}


	// [DELETE ALL] //
	static deleteAll() {
		return async (req, res, next) => { 
			const commentVotes = await loadCommentVotesCollection()
			await commentVotes.deleteMany({
				comment_id: req.params.comment_id,
			})
				.then( next() )
		}
	}
}

	
// [LOAD COLLECTION] Comment Votes //
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


// [EXPORT] //
module.exports = CommentVotesCollection