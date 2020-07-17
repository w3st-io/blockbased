/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
require('dotenv').config()


// [REQUIRE] Personal //
const Auth = require('../../server-middleware/AuthMiddleware')
const BlocksCollection = require('../../server-collections/BlocksCollection')
const CommentsCollection = require('../../server-collections/CommentsCollection')
const CommentLikesCollection = require('../../server-collections/CommentLikesCollection')
const CommentReportsCollection = require('../../server-collections/CommentReportsCollections')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [COMMENT] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userToken(),
	async (req, res) => { 
		const existance = await BlocksCollection.existance(req.body.block_id)

		if (existance == true) {
			const returnedData = await CommentsCollection.create(req)

			res.status(201).send(returnedData)
		}
		else { res.status(400).send() }
	}
)


// [READ-ALL-ALL] //
router.get(
	'/read-all-all/:amount/:skip',
	async (req, res) => {
		const returnedData = await CommentsCollection.readAllAll(req)
		
		res.status(200).send(returnedData)
	}
)


// [READ-ALL] //
router.get(
	'/read-all/:block_id/:amount/:skip',
	async (req, res) => {
		const returnedData = await CommentsCollection.readAll(req)
		
		res.status(200).send(returnedData)
		
	}
)


// [READ] //
router.get(
	'/read/:_id',
	async (req, res) => {
		const returnedData = await CommentsCollection.read(req)

		res.status(201).send(returnedData)
	}
)


// [UPDATE] Auth Required //
router.post(
	'/update/:_id',
	Auth.userToken(),
	async (req, res) => {
		const owned = await CommentsCollection.ownership(req)

		if (owned == true) {
			await CommentsCollection.update(req)

			res.status(201).send()
		}
		else { res.status(400).send() }
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.userToken(),
	async (req, res) => {
		const owned = await CommentsCollection.ownership(req)

		if (owned == true) {
			await CommentsCollection.delete(req)
			await CommentLikesCollection.deleteAll(req)

			res.status(201).send()
		}
		else { res.status(400).send() }
	}
)


/******************* [VOTE SYSTEM] *******************/
// [PUSH] Auth Required //
router.post(
	'/like/:_id/:block_id',
	Auth.userToken(),
	async (req, res) => {
		const existance = await CommentsCollection.LikeExistance(req)

		if (!existance) {
			await CommentsCollection.like(req)
			await CommentLikesCollection.create(req)

			res.status(201).send()
		}
		else { res.status(400).send('Comment like already exists.') }
	}
)


// [PULL] Auth Required //
router.post(
	'/unlike/:_id',
	Auth.userToken(),
	async (req, res) => {
		const existance = await CommentsCollection.LikeExistance(req)
		
		if (existance) {
			await CommentsCollection.unlike(req)
			await CommentLikesCollection.delete(req)

			res.status(201).send()
		}
		else { 
			console.log('/unlike/400')
			res.status(400).send('CommentLike does not exists.') }
	}
)


/******************* [REPORTS] *******************/
// [CREATE] //
router.post(
	'/report/:_id',
	Auth.userToken(),
	async (req, res) => {
		const existance = await CommentReportsCollection.existance(req)
		
		if (!existance) {
			await CommentReportsCollection.create(req)
			
			res.status(201).send()
		}
		else { res.status(400).send() }
	}
)

/******************* [EXISTANCE + OWNERSHIP] *******************/
// [EXISTANCE] //
router.get(
	'/existance/:_id',
	async (req, res) => {
		const existance = await CommentsCollection.existance(req.params._id)

		if (existance == true) { res.status(200).send(true) }
		else { res.status(400).send(false) }
	},
)


// [OWNERSHIP] //
router.get(
	'/ownership/:_id',
	Auth.userToken(),
	async (req, res) => {
		const owned = await CommentsCollection.ownership(req)

		if (owned == true) { res.status(200).send(true) }
		else { res.status(200).send(false) }
	}
)


/******************* [COUNT] *******************/
router.get(
	'/count/:block_id',
	async (req, res) => {
		const count = (await CommentsCollection.count(req)).toString()
	
		res.status(201).send(count)
	}
)


// [EXPORT] //
module.exports = router