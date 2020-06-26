/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK AUTHORIZATION MIDDLEWARE %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 */
// [REQUIRE] //
const jwt = require('jsonwebtoken')
const mongodb = require('mongodb')
require('dotenv').config()


// [REQUIRE] Personal //
const Collections = require('../server-collections')


class BlockAuthMiddleware {
	static verifyOwnership() {
		return async (req, res, next) => {
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
	}
}


// [EXPORT] //
module.exports = BlockAuthMiddleware
