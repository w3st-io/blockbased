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


class CommentAuthMiddleware {
	// 
	static verifyOwnership() {
		return async (req, res, next) => {
			const comments = await Collections.loadCommentsCollection()
			let returnedData = await comments.findOne({	
				_id: new mongodb.ObjectID(req.params._id),
				user_id: req.decoded._id,
			})

			if (returnedData) { next() }
			else {
				console.log('error')
				return res.status(401).send({
					auth: false,
					error: 'Sorry man, you dont own this comment!'
				})
			}
		}
	}


	// this does the same thing except the id is named differently
	static verifyOwnershipCommentId() {
		return async (req, res, next) => {
			const comments = await Collections.loadCommentsCollection()
			let returnedData = await comments.findOne({	
				_id: new mongodb.ObjectID(req.params.comment_id),
				user_id: req.decoded._id,
			})

			if (returnedData) { next() }
			else {
				console.log('error')
				return res.status(401).send({
					auth: false,
					error: 'Sorry man, you dont own this comment!'
				})
			}
		}
	}

	
	static voterVerifyNonExistance() {
		// This function should check if a voter 
		// does exist in the comments array this 
		// is to prevent multiple insertion of the
		// same voter
		return async (req, res, next) => { next() }
	}
}


// [EXPORT] //
module.exports = CommentAuthMiddleware
