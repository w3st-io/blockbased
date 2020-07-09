/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% USERS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongodb = require('mongodb')
require('dotenv').config()


// [LOAD COLLECTION] users //
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


class UsersCollection {
	/******************* [CRUD] *******************/
	// [READ] //
	static read() {
		return async (req, res, next) => {
			const user_id = req.decoded._id
			
			try {
				const users = await loadUsersCollection()
				const retrievedData = await users.findOne({
					_id: new mongodb.ObjectID(user_id)
				})

				if (retrievedData) { req.retrievedData = retrievedData }
				else { req.retrievedData = '' }

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


	// [READ] Profile Image //
	static readProfilePic() {
		return async (req, res, next) => {
			try {
				const users = await loadUsersCollection()
				const retrievedData = await users.findOne(
					{ _id: new mongodb.ObjectID(req.params._id) },
					{ projection: { profilePicURL: 1 } }
				)

				if (retrievedData) { req.retrievedData = retrievedData }
				else { req.retrievedData = '' }

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


	// [UPDATE] //
	static update() {
		return async (req, res, next) => {
			try {
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


	/******************* [VALIDATE] *******************/
	/******************* [COUNT] *******************/
}


// [EXPORT] //
module.exports = UsersCollection
