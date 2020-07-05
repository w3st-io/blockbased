/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const jwt = require('jsonwebtoken')
const mongodb = require('mongodb')
require('dotenv').config()


// [REQUIRE] Personal //
const Collections = require('../../server-collections')


// [REQUIRE] Personal //
const Auth = require('../../server-middleware/AuthMiddleware')
const CommentM = require('../../server-middleware/CommentMiddleware')


// [INIT] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userTokenCheck(),
	async (req, res) => {
		const comments = await Collections.loadCommentsCollection()
		await comments.insertOne({
			createdAt: new Date(),
			block_id: req.body.block_id,
			comment: req.body.comment,
			voters: [],
			user_id: req.decoded._id,
			email: req.decoded.email,
			username: req.decoded.username,
		})

		res.status(201).send({
			auth: true,
			message: 'Created Comment'
		})
	}
)


// [READ-ALL] //
router.get('/read-all/:block_id/:amountPerPage/:skip', async (req, res) => {
	let skip = parseInt(req.params.skip)
	let amountPerPage = parseInt(req.params.amountPerPage)

	const comments = await Collections.loadCommentsCollection()
	let retrievedData = await comments.find(
		{ block_id: req.params.block_id }
	)
		.skip(skip)
		.limit(amountPerPage)
		.toArray()

	res.send(retrievedData)
})


// [READ] //
router.get('/read/:_id', async (req, res) => {
	let validId = mongodb.ObjectID.isValid(req.params._id)
	
	if (validId) {
		const comments = await Collections.loadCommentsCollection()
		let retrievedData = await comments.findOne(
			{ _id: new mongodb.ObjectID(req.params._id) }
		)

		res.send(retrievedData)
	}
	else { res.sendStatus(400) }
})


// [UPDATE] Auth Required //
router.post(
	'/update/:_id',
	Auth.userTokenCheck(),
	CommentM.verifyOwnership(),
	async (req, res) => {
		const comments = await Collections.loadCommentsCollection()
		await comments.findOneAndUpdate(
			{ _id: new mongodb.ObjectID(req.params._id) },
			{
				$set: {
					comment: req.body.comment,
				}
			},
			{ upsert: true }
		)

		res.status(201).send({
			auth: true,
			message: 'Successfully Updated Comment'
		})
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.userTokenCheck(),
	CommentM.verifyOwnership(),
	async (req, res) => {
		const comments = await Collections.loadCommentsCollection()
		await comments.deleteOne({
			_id: new mongodb.ObjectID(req.params._id),
			user_id: req.decoded._id,
		})

		res.status(201).send({
			auth: true,
			message: 'Successfully Deleted Comment'
		})
	}
)


/******************* [VOTE SYSTEM] *******************/
// [PUSH] Auth Required //
router.post(
	'/update/push-voter/:_id',
	Auth.userTokenCheck(),
	CommentM.voterVerifyNonExistance(),
	async (req, res) => {
		const comments = await Collections.loadCommentsCollection()
		await comments.updateOne(
			{ _id: new mongodb.ObjectID(req.params._id) },
			{ $push:
				{ 
					voters: {
						user_id: req.decoded._id,
						email: req.decoded.email,
						username: req.decoded.username,
					}
				}
			},
			{ upsert: true }
		)

		res.status(201).send()
	}
)


// [PULL] Auth Required //
router.post(
	'/update/pull-voter/:_id',
	Auth.userTokenCheck(),
	async (req, res) => {
	const comments = await Collections.loadCommentsCollection()
	await comments.updateOne(
		{ _id: new mongodb.ObjectID(req.params._id) },
		{ $pull: { voters: { user_id: req.decoded._id } } },
		{ upsert: true }
	)

	res.status(201).send()
})


/******************* [COUNT] *******************/
router.get('/count/:block_id', async (req, res) => {
	const comments = await Collections.loadCommentsCollection()
	try {
		const count = await comments.countDocuments(
			{ block_id: req.params.block_id }
		)
		res.status(201).send(count.toString())
	}
	catch(e) { res.send(e) }
})


// [EXPORT] //
module.exports = router