/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENTS ROUTE %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const express = require('express')
const mongodb = require('mongodb')

// [REQUIRE] Personal //
require('dotenv').config()

// [INIT] //
const router = express.Router()

/******************* [COMMENT CRUD] *******************/
// [CREATE] //
router.post('/create', async (req, res) => {
	const comments = await loadCommentsCollection()
	await comments.insertOne({
		createdAt: new Date(),
		block_id: req.body.block_id,
		user_id: req.body.user_id,
		email: req.body.email,
		username: req.body.username,
		comment: req.body.comment,
		voteCount: 0,
		voters: [],
		
	}).then((result) => {
		res.json({ newCommentId: result.insertedId })
	})

	res.status(201).send()
})


// [READ-ALL] //
router.get('/read-all/:block_id/:amountPerPage/:skip', async (req, res) => {
	let skip = parseInt(req.params.skip)
	let amountPerPage = parseInt(req.params.amountPerPage)

	const comments = await loadCommentsCollection()
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
		const comments = await loadCommentsCollection()

		let retrievedData = await comments.findOne(
			{ _id: new mongodb.ObjectID(req.params._id) }
		)

		res.send(retrievedData)
	}
	else { res.sendStatus(400) }
})


/*** [UPDATE] Add event ***/
router.post('/update/:_id', async (req, res) => {
	let validId = mongodb.ObjectID.isValid(req.params._id)

	if (validId) {
		const comments = await loadCommentsCollection()
		await comments.findOneAndUpdate(
			{ _id: new mongodb.ObjectID(req.params._id) },
			{
				$set: {
					comment: req.body.comment,
				}
			},
			{ upsert: true }
		)

		res.status(201).send()
	}
	else { res.sendStatus(400) }
})


/*** [DELETE] Delete Post ***/
router.delete('/delete/:_id', async (req, res) => {
	let validId = mongodb.ObjectID.isValid(req.params._id)

	if (validId) {
		const comments = await loadCommentsCollection()	
		await comments.deleteOne(
			{ _id: new mongodb.ObjectID(req.params._id) }
		)

		res.status(201).send()
	}
	else { res.sendStatus(400) }
})


/******************* [VOTE SYSTEM] *******************/
// INCREMENT + DECREMENT VOTECOUNT //
router.post('/update/increment-vote-count/:_id', async (req, res) => {
	const comments = await loadCommentsCollection()

	comments.findOneAndUpdate(
		{ _id: new mongodb.ObjectID(req.params._id) },
		{ $inc: { voteCount: 1 } },
		{ upsert: true }
	)

	res.status(201).send()
})
router.post('/update/decrement-vote-count/:_id', async (req, res) => {
	const comments = await loadCommentsCollection()

	comments.findOneAndUpdate(
		{ _id: new mongodb.ObjectID(req.params._id) },
		{ $inc: { voteCount: -1 } },
		{ upsert: true }
	)

	res.status(201).send()
})


// PUSH/PULL USER FROM VOTERS ARRAY //
router.post('/update/push-voter/:_id', async (req, res) => {
	const comments = await loadCommentsCollection()

	comments.updateOne(
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
router.post('/update/pull-voter/:_id', async (req, res) => {
	const comments = await loadCommentsCollection()

	comments.updateOne(
		{ _id: new mongodb.ObjectID(req.params._id) },
		{ $pull: { voters: { user_id: req.body.user_id } } },
		{ upsert: true }
	)

	res.status(201).send()
})


/******************* [LOAD COLLECTION] comments *******************/
async function loadCommentsCollection() {
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'blockbased'
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


// [EXPORT] //
module.exports = router