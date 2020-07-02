// [REQUIRE] //
const mongodb = require('mongodb')
require('dotenv').config()


class ServerCollections {
	// [ADMINS] //
	static async loadAdminsCollection() {
		const uri = process.env.MONGO_URI
		const db_name = process.env.DB || 'db_name'
		const c_name = 'admins'
		
		const client = await mongodb.MongoClient.connect(
			uri,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true
			}	
		)

		return client.db(db_name).collection(c_name)
	}


	// [BLOCKS] //
	static async loadBlocksCollection() {
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


	// [BLOCK-VOTES] //
	static async loadBlockVotesCollection() {
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


	// [CATS] //
	static async loadCatsCollection() {
		const uri = process.env.MONGO_URI
		const db_name = process.env.DB || 'db_name'
		const c_name = 'cats'
		
		const client = await mongodb.MongoClient.connect(
			uri,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true
			}
		)

		return client.db(db_name).collection(c_name)
	}


	// [COMMENTS] //
	static async loadCommentsCollection() {
		const uri = process.env.MONGO_URI
		const db_name = process.env.DB || 'db_name'
		const c_name = 'comments'

		const client = await mongodb.MongoClient.connect(
			uri,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true
			}
		)

		return client.db(db_name).collection(c_name)
	}


	// [COMMENT-VOTES] //
	static async loadCommentVotesCollection() {
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


	// [FORUMS] //
	static async loadForumsCollection() {
		const uri = process.env.MONGO_URI
		const db_name = process.env.DB || 'db_name'
		const c_name = 'forums'
		
		const client = await mongodb.MongoClient.connect(
			uri,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true
			}
		)
	
		return client.db(db_name).collection(c_name)
	}


	// [REPORTS] // 
	static async loadReportsCollection() {
		const uri = process.env.MONGO_URI
		const db_name = process.env.DB || 'db_name'
		const c_name = 'reports'
		
		const client = await mongodb.MongoClient.connect(
			uri,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true
			}	
		)
		
		return client.db(db_name).collection(c_name)
	}
	

	// [USERS] //
	static async loadUsersCollection() {
		const uri = process.env.MONGO_URI
		const db_name = process.env.DB || 'db_name'
		const c_name = 'users'
		
		const client = await mongodb.MongoClient.connect(
			uri,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true
			}	
		)
		
		return client.db(db_name).collection(c_name)
	}
}


// [EXPORT] //
module.exports = ServerCollections
