/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongodb = require('mongodb')


// [REQUIRE] Personal //
const Auth = require('../../../server-middleware/AuthMiddleware')
require('dotenv').config()


// [INIT] //
const router = express.Router().use(cors())


/******************* [COMMENT CRUD] *******************/
// [READ-ALL] Auth Required //
router.get('/read-all/:amountPerPage/:skip', Auth.adminCheck(), async (req, res) => {
	let skip = parseInt(req.params.skip)
	let amountPerPage = parseInt(req.params.amountPerPage)

	const comments = await loadCommentsCollection()
	let retrievedData = await comments.find()
		.skip(skip)
		.limit(amountPerPage)
		.toArray()

	res.send(retrievedData)
})


// [READ-ALL] Auth Required - Within a Block //
router.get('/read-all/:block_id/:amountPerPage/:skip', Auth.adminCheck(), async (req, res) => {
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


// [READ] Auth Required //
router.get('/read/:_id', Auth.adminCheck(), async (req, res) => {
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


// [UPDATE] Auth Required //
router.post('/update/:_id', Auth.adminCheck(), async (req, res) => {
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


// [DELETE] Auth Required //
router.delete('/delete/:_id', Auth.adminCheck(), async (req, res) => {
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
// [PUSH] Auth Required //
router.post('/update/push-voter/:_id', Auth.adminCheck(), async (req, res) => {
	const comments = await loadCommentsCollection()
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
router.post('/update/pull-voter/:_id', Auth.adminCheck(), async (req, res) => {
	const comments = await loadCommentsCollection()
	await comments.updateOne(
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