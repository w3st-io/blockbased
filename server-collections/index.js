// [REQUIRE] //
const mongodb = require('mongodb')
require('dotenv').config()


class ServerCollections {
	/******************* [COLLECTION] blocks *******************/
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

	/******************* [COLLECTION] blocks *******************/
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
}


// [EXPORT] //
module.exports = ServerCollections
