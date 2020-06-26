/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINSTRATION BLOCK ROUTES %%% *
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


// [INIT] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ ALL] Auth Required //
router.get('/read-all/:amountPerPage/:skip', Auth.adminCheck(), async (req, res) => {
	let skip = parseInt(req.params.skip)
	let amountPerPage = parseInt(req.params.amountPerPage)

	const blocks = await Collections.loadBlocksCollection()
	let retrievedData = await blocks.find()
		.skip(skip)
		.limit(amountPerPage)
		.toArray()

	res.send(retrievedData)
})


// [READ ALL] Auth Required - Within a Cat //
router.get('/read-all/:cat_id/:amountPerPage/:skip', Auth.adminCheck(), async (req, res) => {
	let skip = parseInt(req.params.skip)
	let amountPerPage = parseInt(req.params.amountPerPage)
	
	const blocks = await Collections.loadBlocksCollection()
	let retrievedData = await blocks.find(
		{ cat_id: req.params.cat_id }
	)
		.skip(skip)
		.limit(amountPerPage)
		.toArray()

	res.send(retrievedData)
})


// [READ] Auth Required - Single Block Details //
router.get(`/read/:block_id`, Auth.adminCheck(), async (req, res) => {
	const blocks = await Collections.loadBlocksCollection()
	let retrievedData = await blocks.findOne(
		{ _id: new mongodb.ObjectID(req.params.block_id) }
	)

	res.send(retrievedData)
})


// [DELETE] Auth Required //
router.delete('/delete/:_id', Auth.adminCheck(), async (req, res) => {
	let validId = mongodb.ObjectID.isValid(req.params._id)

	if (validId) {
		const blocks = await Collections.loadBlocksCollection()	
		await blocks.deleteOne(
			{ _id: new mongodb.ObjectID(req.params._id) }
		)

		res.status(201).send()
	}
	else { res.sendStatus(400) }
})


/******************* [VOTE SYSTEM] *******************/
// [PUSH] Auth Required //
router.post('/update/push-voter/:_id', Auth.adminCheck(), async (req, res) => {
	const blocks = await Collections.loadBlocksCollection()

	blocks.updateOne(
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
	const blocks = await Collections.loadBlocksCollection()

	blocks.updateOne(
		{ _id: new mongodb.ObjectID(req.params._id) },
		{ $pull: { voters: { user_id: req.body.user_id } } },
		{ upsert: true }
	)

	res.status(201).send()
})


// [EXPORT] //
module.exports = router