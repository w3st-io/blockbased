/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% FOLLOWS MIDDLEWARE %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%% *
 */
// [REQUIRE] //
const mongodb = require('mongodb')
require('dotenv').config()


// [REQUIRE] Personal //
const Collections = require('../server-collections')


class FollowsMiddleware {
	static verifyOwnership() {
		return async (req, res, next) => {
			if (mongodb.ObjectID.isValid(req.params._id)) {
				const follows = await Collections.loadFollowsCollection()
				let returnedData = await follows.findOne(
					{
						_id: new mongodb.ObjectID(req.params._id),
						user_id: req.decoded._id,
					}
				)

				if (returnedData) { next() }
				else {
					return res.status(401).send({
						auth: false,
						error: 'Sorry man, you dont own this follow!'
					})
				}
			}
			else { res.status(400).send({ error: 'Invalid Id'}) }
		}
	}


	static verifyNonExistance() {
		// This function should check if a voter 
		// does exist in the comments array
		return async (req, res, next) => { next() }
	}
}


// [EXPORT] //
module.exports = FollowsMiddleware
