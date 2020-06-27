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
const CommentAuth = require('../../server-middleware/CommentAuthMiddleware')


// [INIT] //
const router = express.Router().use(cors())
const secretKey = process.env.SECRET_KEY || 'secret'


/******************* [COMMENT CRUD] *******************/
// [CREATE] Auth Required //
router.post('/create', Auth.userCheck(), async (req, res) => {
	const comments = await Collections.loadCommentsCollection()
	await comments.insertOne({
		createdAt: new Date(),
		block_id: req.body.block_id,
		user_id: req.body.user_id,
		email: req.body.email,
		username: req.body.username,
		comment: req.body.comment,
		voters: [],
		
	}).then(() => {
		res.status(201).send({
			auth: true,
			message: 'Successfully Created Comment'
		})
	})
})


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
router.post('/update/:_id', Auth.userCheck(), CommentAuth.verifyOwnership(), async (req, res) => {
	if (mongodb.ObjectID.isValid(req.params._id)) {
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
	else { res.sendStatus(400) }
})


// [DELETE] Auth Required //
router.delete('/delete/:_id', Auth.userCheck(), CommentAuth.verifyOwnership(), async (req, res) => {
	if (mongodb.ObjectID.isValid(req.params._id)) {
		const comment_id = req.params._id

		if (req.decoded) {
			const comments = await Collections.loadCommentsCollection()
			await comments.deleteOne({
				_id: new mongodb.ObjectID(comment_id),
				user_id: req.decoded._id,
			})

			res.status(201).send({
				auth: true,
				message: 'Successfully Deleted Comment'
			})
		}
		else {
			console.log(`JWT Error: ${err}`)
			res.status(401).send({
				auth: false,
				error: 'No Token, did you use Auth.userCheck()..?'
			})
		}
		
	}
	else { res.status(400).send({ error: 'Invalid Id'}) }
})


/******************* [VOTE SYSTEM] *******************/
// [PUSH] Auth Required //
router.post('/update/push-voter/:_id', Auth.userCheck(), async (req, res) => {
	const comments = await Collections.loadCommentsCollection()
	await comments.updateOne(
		{ _id: new mongodb.ObjectID(req.params._id) },
		{ $push:
			{ 
				voters: {
					user_id: req.body.user_id,
					email: req.body.email,
					username: req.body.username,
				} 
			}
		},
		{ upsert: true }
	)

	res.status(201).send()
})


// [PULL] Auth Required //
router.post('/update/pull-voter/:_id', Auth.userCheck(), async (req, res) => {
	const comments = await Collections.loadCommentsCollection()
	await comments.updateOne(
		{ _id: new mongodb.ObjectID(req.params._id) },
		{ $pull: { voters: { user_id: req.body.user_id } } },
		{ upsert: true }
	)

	res.status(201).send()
})


// [EXPORT] //
module.exports = router