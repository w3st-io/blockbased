/**
 * %%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
require('dotenv').config()


// [REQUIRE] Personal //
const Auth = require('../../server-middleware/AuthMiddleware')
const BlocksCollection = require('../../server-collections/BlocksCollection')
const BlockLikesCollection = require('../../server-collections/BlockLikesCollection')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userToken(),
	async (req, res) => {
		const returnedData = await BlocksCollection.create(
			req.decoded._id,
			req.body.cat_id,
			req.body.title
		)

		res.status(201).send(returnedData)
	}
)


// [READ-ALL] Within Cat //
router.get(
	'/read-all/:cat_id/:amount/:skip',
	async (req, res) => {
		const returnedData = await BlocksCollection.readAll(
			req.params.cat_id,
			req.params.skip,
			req.params.amount
		)

		res.status(200).send(returnedData)
	}
)


// [READ] Single Block //
router.get(
	'/read/:_id',
	async (req, res) => {
		const returnedData = await BlocksCollection.read(req.params._id)

		res.status(200).send(returnedData)
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.userToken(),
	async (req, res) => {
		const ownership = await BlocksCollection.ownership(
			req.decoded._id,
			req.params._id
		)
		
		if (ownership.status) {
			if (ownership.ownership) {
				const returnedData1 = await BlocksCollection.delete(req.params._id)
				const returnedData2 = await BlockLikesCollection.deleteAll(req.params._id)

				res.status(200).send(returnedData1)
			}
			else { res.status(401).send() }
		}
		else { res.status(400).send(ownership.message) }
	}
)


/******************* [VOTE SYSTEM] *******************/
// [LIKE] Auth Required //
router.post(
	'/like/:_id',
	Auth.userToken(),
	async (req, res) => {
		const likeExistance = await BlocksCollection.likeExistance()
		
		if (likeExistance == true) {
			const returnedData1 = await BlocksCollection.like(
				req.decoded._id,
				req.params._id
			)
			const returnedData2 = await BlockLikesCollection.create(
				req.decoded._id,
				req.params._id
			)
			
			res.status(201).send(returnedData2)
		}
		else { res.status(400).send() }
	}
)


// [UNLIKE] Auth Required //
router.post(
	'/unlike/:_id',
	Auth.userToken(),
	async (req, res) => {
		const likeExistance = await BlocksCollection.likeExistance()
		
		if (likeExistance == true) {
			const returnedData1 = await BlocksCollection.unlike(
				req.decoded._id,
				req.params._id
			)
			const returnedData2 = await BlockLikesCollection.delete(
				req.decoded._id,
				req.params._id
			)
			
			res.status(201).send(returnedData2)
		}
		else { res.status(400).send() }
	}
)


// [LIKE-EXISTANCE] // INCOMPLETE!
router.post(
	'/like-existance/:_id',
	Auth.userToken(),
	async (req, res) => {
		res.status(200).send('INCOMPLETE!')
	}
)


/******************* [EXISTANCE + OWNERSHIP] *******************/
// [EXISTANCE] //
router.get(
	'/existance/:_id',
	async (req, res) => {
		const existance = await BlocksCollection.existance(req.params._id)

		if (existance.status == true) {
			if (existance.existance == true) { res.status(200).send(true) }
			else { res.status(200).send(false) }
		}
		else { res.send(400).send(existance.message) }
	},
)


// [OWNERSHIP] //
router.get(
	'/ownership/:_id',
	Auth.userToken(),
	async (req, res) => {
		const ownership = await BlocksCollection.ownership(
			req.decoded._id,
			req.params._id
		)

		if (ownership.status == true) {
			if (ownership.ownership == true) { res.status(200).send(true) }
			else { res.status(200).send(false) }
		}
		else { res.status(400).send(ownership.message) }
	}
)


/******************* [COUNT] *******************/
router.get(
	'/count/:cat_id',
	async (req, res) => {
		const count = (await BlocksCollection.count(req.params.cat_id)).toString()

		res.status(200).send(count)
	}
)


// [EXPORT] //
module.exports = router