/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK MIDDLEWARE %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 */
// [REQUIRE] //
const jwt = require('jsonwebtoken')
const mongodb = require('mongodb')
require('dotenv').config()


// [REQUIRE] Personal //
const Collections = require('../server-collections')


class BlocksMiddleware {
	static verifyOwnership() {
		return async (req, res, next) => {
			if (mongodb.ObjectID.isValid(req.params._id)) {
				const blocks = await Collections.loadBlocksCollection()
				let returnedData = await blocks.findOne(
					{
						_id: new mongodb.ObjectID(req.params._id),
						user_id: req.decoded._id,
					}
				)

				if (returnedData) { next() }
				else {
					return res.status(401).send({
						auth: false,
						error: 'Sorry man, you dont own this block!'
					})
				}
			}
			else { res.status(400).send({ error: 'Invalid Id'}) }
		}
	}

	
	static voterVerifyNonExistance() {
		// This function should check if a voter 
		// does exist in the comments array
		return async (req, res, next) => { next() }
	}
}


// [EXPORT] //
module.exports = BlocksMiddleware
