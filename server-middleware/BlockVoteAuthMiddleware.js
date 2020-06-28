/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK VOTE AUTHORIZATION MIDDLEWARE %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 */
// [REQUIRE] //
const jwt = require('jsonwebtoken')
const mongodb = require('mongodb')
require('dotenv').config()


// [REQUIRE] Personal //
const Collections = require('../server-collections')


class BlockVoteAuthMiddleware {
	static verifyOwnership() {
		return async (req, res, next) => {
			if (req.params.user_id == req.decoded._id) {
				const blockVotes = await Collections.loadBlockVotesCollection()
				let returnedData = await blockVotes.findOne(
					{
						block_id: req.params.block_id,
						user_id: req.decoded._id,
					}
				)

				if (returnedData) { next() }
				else {
					return res.status(401).send({
						auth: false,
						error: 'Sorry man, you dont own this block-vote!'
					})
				}
			}
			else {
				return res.status(401).send({
					auth: false,
					error: 'Bro you cant block vote for someone else! LMAO'
				})
			}
		}
	}

	static verifyNonExistance() {
		return async (req, res, next) => {
			if (req.body.user_id == req.decoded._id) {
				const blockVotes = await Collections.loadBlockVotesCollection()
				let returnedData = await blockVotes.findOne(
					{
						block_id: req.body.block_id,
						user_id: req.decoded._id,
					}
				)

				if (!returnedData) { next() }
				else {
					return res.status(401).send({
						auth: true,
						error: 'Sorry man, block-vote already exists!'
					})
				}
			}
			else {
				return res.status(401).send({
					auth: false,
					error: 'Bro you cant block vote for someone else! LMAO'
				})
			}
		}
	}
}


// [EXPORT] //
module.exports = BlockVoteAuthMiddleware
