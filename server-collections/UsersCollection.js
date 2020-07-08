/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% USERS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongodb = require('mongodb')
require('dotenv').config()


class UsersCollection {
	/******************* [CRUD] *******************/
	// [READ] //
	static async read(req) {
		const user_id = req.decoded._id
		const users = await loadUsersCollection()
		const retrievedData = await users.findOne(
			{ _id: new mongodb.ObjectID(user_id) }
		)

		return retrievedData
	}

	// [READ] Profile Image //
	static async readProfilePic(req) {
		const users = await loadUsersCollection()
		const retrievedData = await users.findOne(
			{ _id: new mongodb.ObjectID(req.params._id) },
			{ projection: { profilePicURL: 1 } }
		)

		return retrievedData
	}

	// [UPDATE] //
	static async update(req) {
		const users = await loadUsersCollection()
		await users.findOneAndUpdate(
			{ _id: new mongodb.ObjectID(req.decoded._id) },
			{
				$set: {
					profilePicURL: req.body.img_url,
					
				}
			},
			{ upsert: true }
		)
	}

	/******************* [VALIDATE] *******************/

	/******************* [COUNT] *******************/
}


// [LOAD COLLECTION] //
async function loadUsersCollection() {
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


// [EXPORT] //
module.exports = UsersCollection
