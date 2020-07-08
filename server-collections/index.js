// [REQUIRE] //
const mongodb = require('mongodb')
require('dotenv').config()


// [INIT] //
const uri = process.env.MONGO_URI
const db_name = process.env.DB || 'db_name'


class ServerCollections {
	// [ADMINS] //
	static async loadAdminsCollection() {
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


	// [CATS] //
	static async loadCatsCollection() {
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

	// [FOLLOWS] //
	static async loadFollowsCollection() {
		const c_name = 'follows'
		
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
