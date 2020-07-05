/**
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK VOTE ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongodb = require('mongodb')
require('dotenv').config()


// [REQUIRE] Personal //
const Auth = require('../../server-middleware/AuthMiddleware')
const BlockVotesM = require('../../server-middleware/BlockVotesMiddleware')
const Collections = require('../../server-collections')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userTokenCheck(),
	BlockVotesM.verifyNonExistance(),
	async (req, res) => {
		const blockVotes = await Collections.loadBlockVotesCollection()
		await blockVotes.insertOne({
			createdAt: new Date(),
			block_id: req.body.block_id,
			user_id: req.decoded._id,
			email: req.decoded.email,
			username: req.decoded.username,
		})

		res.status(201).send({
			auth: true,
			message: 'Created blockVote'
		})
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:block_id',
	Auth.userTokenCheck(),
	BlockVotesM.verifyOwnership(),
	async (req, res) => {
		const blockVotes = await Collections.loadBlockVotesCollection()
		await blockVotes.deleteMany({
			block_id: req.params.block_id,
			user_id: req.decoded._id,
		})

		res.status(200).send({
			auth: true,
			message: 'Deleted blockVote'
		})
	}
)


// [EXPORT] //
module.exports = router