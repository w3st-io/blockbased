/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT VOTES COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')
const mongodb = require('mongodb')
require('dotenv').config()


// [LOAD COLLECTION] commentLikes //
async function loadCommentLikesCollection() {
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'db_name'
	const c_name = 'commentLikes'
	
	const client = await mongodb.MongoClient.connect(
		uri,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)

	return client.db(db_name).collection(c_name)
}


class CommentLikesCollection {
	/******************* [CRRUD] *******************/
	// [CREATE] //
	static async create(req) {
		try {
			const commentLikes = await loadCommentLikesCollection()
			await commentLikes.insertOne({
				createdAt: new Date(),
				block_id: mongoose.Types.ObjectId(req.params.block_id),
				comment_id: mongoose.Types.ObjectId(req.params._id),
				user_id: mongoose.Types.ObjectId(req.decoded._id),
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
			const commentLikes = await loadCommentLikesCollection()
			await commentLikes.deleteMany({
				comment_id: mongoose.Types.ObjectId(req.params._id),
				user_id: mongoose.Types.ObjectId(req.decoded._id),
			})
			
			return
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	// [DELETE ALL] //
	static async deleteAll(req) {
		try {
			const commentLikes = await loadCommentLikesCollection()
			await commentLikes.deleteMany(
				{ comment_id: mongoose.Types.ObjectId(req.params.comment_id), }
			)
			
			return
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	/******************* [EXISTANCE + OWNERSHIP] *******************/
	static async existance(comment_id, user_id) {
		if (mongoose.isValidObjectId(comment_id)) {
			try {
				const commentLikes = await Collections.loadCommentLikesCollection()
				const returnedData = await commentLikes.findOne({
					comment_id: mongoose.Types.ObjectId(comment_id),
					user_id: mongoose.Types.ObjectId(user_id),
				})
	
				if (returnedData) { return true }
				else { return false }
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Block ID.' }
	}
	

	static async ownership(req) {
		const commentLikes = await Collections.loadCommentLikesCollection()
		const returnedData = await commentLikes.findOne({
			comment_id: mongoose.Types.ObjectId(req.params.comment_id),
			user_id: mongoose.Types.ObjectId(req.decoded._id),
		})

		if (returnedData) { return true }
		else { return false }
	}
}


// [EXPORT] //
module.exports = CommentLikesCollection