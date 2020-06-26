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


// [INIT] //
const secretKey = process.env.SECRET_KEY || 'secret'


class CommentAuthMiddleWare {
	static verifyOwnership() {
		return async (req, res, next) => {
			const comments = await Collections.loadCommentsCollection()
			let returnedData = await comments.findOne(
				{	
					_id: new mongodb.ObjectID(req.params._id),
					user_id: req.decoded._id,
				}
			)

			if (returnedData) { console.log('d3d');  next() }
			else {
				return res.status(401).send({
					auth: false,
					error: 'Unauthorized to Delete'
				})
			}
		}
	}
}


// [EXPORT] //
module.exports = CommentAuthMiddleWare
