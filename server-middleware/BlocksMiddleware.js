/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK MIDDLEWARE %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 */
// [REQUIRE] //
const mongodb = require('mongodb')
require('dotenv').config()


// [REQUIRE] Personal //
const Collections = require('../server-collections')


class BlocksMiddleware {
	static verifyOwnership() {
		return async (req, res, next) => {
			if (mongodb.ObjectID.isValid(req.params._id)) {
				try {
					const blocks = await Collections.loadBlocksCollection()
					const returnedData = await blocks.findOne({
						_id: new mongodb.ObjectID(req.params._id),
						user_id: req.decoded._id,
					})

					if (returnedData) { next() }
					else {
						return res.status(401).send({
							auth: true,
							error: `${req.decoded.username} do not own this block.`
						})
					}
				}
				catch(e) {
					res.status(400).send({
						auth: true,
						message: `Caught Error: ${e}`,
					})
				}
			}
			else {
				res.status(400).send({
					auth: true,
					message: 'Invalid Block Id.'
				})
			}
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
