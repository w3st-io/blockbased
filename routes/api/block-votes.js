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
const BlockVoteAuth = require('../../server-middleware/BlockVoteAuthMiddleware')
const Collections = require('../../server-collections')


// [INIT] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userCheck(),
	BlockVoteAuth.verifyNonExistance(),
	async (req, res) => {
		if (req.body.user_id == req.decoded._id) {
			const blockVotes = await Collections.loadBlockVotesCollection()
			await blockVotes.insertOne({
				createdAt: new Date(),
				block_id: req.body.block_id,
				user_id: req.body.user_id,
				email: req.body.email,
				username: req.body.username,
			})

			res.status(201).send({
				auth: true,
				message: 'Created blockVote'
			})
		}
		else {
			res.status(401).send({
				auth: false,
				error: 'Bro you cant create a blockVote for someone else!'
			})
		}
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:user_id/:block_id',
	Auth.userCheck(),
	BlockVoteAuth.verifyOwnership(),
	async (req, res) => {
		if (req.params.user_id == req.decoded._id) {
			const blockVotes = await Collections.loadBlockVotesCollection()
			await blockVotes.deleteMany({
				block_id: req.params.block_id,
				user_id: req.params.user_id,
			})

			res.status(200).send({
				auth: true,
				message: 'Deleted blockVote'
			})
		}
		else {
			res.status(401).send({
				auth: false,
				error: 'Bro you cant delete blockVote for someone else!'
			})
		}
	}
)


// [EXPORT] //
module.exports = router