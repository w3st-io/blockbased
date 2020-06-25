/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION USER ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongodb = require('mongodb')


// [REQUIRE] Personal //
const Auth = require('../../../server-middleware/AuthMiddleware')
require('dotenv').config()


// [USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/
// [READ-ALL] Auth Required //
router.get('/read-all/profile-data', Auth.adminCheck(), async (req, res) => {
	const users = await loadUsersCollection()
	let retrievedData = await users.find()
		.toArray()
	
	res.status(201).send(retrievedData)
})


// [READ] Auth Required //
router.get('/read/profile-data/:_id', Auth.adminCheck(), async (req, res) => {
	const users = await loadUsersCollection()
	let retrievedData = await users.findOne(
		{ _id: new mongodb.ObjectID(req.params._id) }
	)
	
	res.status(201).send(retrievedData)
})


// [UPDATE] Auth Required //
router.post('/update/profile-data/:_id', Auth.adminCheck(), async (req, res) => {
	const users = await loadUsersCollection()
	await users.findOneAndUpdate(
		{ _id: new mongodb.ObjectID(req.params._id) },
		{
			$set: {
				profilePicURL: req.body.img_url,
			}
		},
		{ upsert: true }
	)

	res.status(201).send()
})


/******************* [LOAD COLLECTION] users *******************/
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
module.exports = router