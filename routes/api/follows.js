/**
 * %%%%%%%%%%%%%%%%%%%%% *
 * %%% FOLLOW ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongodb = require('mongodb')
require('dotenv').config()


// [REQUIRE] Personal //
const Collections = require('../../server-collections')
const Auth = require('../../server-middleware/AuthMiddleware')
const FollowsM = require('../../server-middleware/FollowsMiddleware')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userTokenCheck(),
	FollowsM.verifyNonExistance(),
	async (req, res) => {
		const follows = await Collections.loadFollowsCollection()
		await follows.insertOne({
			createdAt: new Date(),
			block_id: req.body.block_id,
			user_id: req.decoded._id,
			email: req.decoded.email,
			username: req.decoded.username,
		})

		res.status(201).send({
			auth: true,
			message: 'Created follow.'
		})
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:block_id',
	Auth.userTokenCheck(),
	FollowsM.verifyOwnership(),
	async (req, res) => {
		const follows = await Collections.loadFollowsCollection()
		await follows.deleteMany({
			block_id: req.params.block_id,
			user_id: req.decoded._id,
		})

		res.status(200).send({
			auth: true,
			message: 'Deleted follow.'
		})
	}
)


/******************* [VOTE SYSTEM] *******************/
// [PUSH] Auth Required //
router.post(
	'/update/push-follower/:_id',
	Auth.userTokenCheck(),
	//BlocksM.voterVerifyNonExistance(),
	async (req, res) => {
		const blocks = await Collections.loadBlocksCollection()
		await blocks.updateOne(
			{ _id: new mongodb.ObjectID(req.params._id) },
			{ $push: { 
				followers: {
					user_id: req.decoded._id,
				}
			} },
			{ upsert: true }
		)

		res.status(201).send()
	}
)


// [PULL] Auth Required //
router.post(
	'/update/pull-follower/:_id',
	Auth.userTokenCheck(),
	async (req, res) => {
		const blocks = await Collections.loadBlocksCollection()
		await blocks.updateOne(
			{ _id: new mongodb.ObjectID(req.params._id) },
			{ $pull: { followers: { user_id: req.decoded._id } } },
			{ upsert: true }
		)

		res.status(201).send()
	}
)


// [EXPORT] //
module.exports = router