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
	static create() {
		return async (req, res, next) => { 
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
				const commentVotes = await loadCommentVotesCollection()
				await commentVotes.deleteMany({
					comment_id: req.params._id,
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
				const commentVotes = await loadCommentVotesCollection()
				await commentVotes.deleteMany({
					comment_id: req.params.comment_id,
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
module.exports = CommentVotesCollection