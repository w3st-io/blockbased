/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION USER ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongodb = require('mongodb')
require('dotenv').config()


// [REQUIRE] Personal //
const Auth = require('../../../server-middleware/AuthMiddleware')
const Collections = require('../../../server-collections')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/
// [READ-ALL] Auth Required //
router.get(
	'/read-all/profile-data',
	Auth.adminCheck(),
	async (req, res) => {
		const users = await Collections.loadUsersCollection()
		let retrievedData = await users.find()
			.toArray()
		
		res.status(201).send(retrievedData)
	}
)


// [READ] Auth Required //
router.get(
	'/read/:_id',
	Auth.adminCheck(),
	async (req, res) => {
		const users = await Collections.loadUsersCollection()
		let retrievedData = await users.findOne(
			{ _id: new mongodb.ObjectID(req.params._id) }
		)
		
		res.status(201).send(retrievedData)
	}
)


// [UPDATE] Auth Required //
router.post(
	'/update/:_id',
	Auth.adminCheck(),
	async (req, res) => {
		const users = await Collections.loadUsersCollection()
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
	}
)


// [EXPORT] //
module.exports = router