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


class CommentMiddleware {
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
		return async (req, res, next) => {
			const comments = await Collections.loadCommentsCollection()
			let returnedValue = await comments.find({
				_id: mongodb.ObjectID(req.params._id),
				voters: {
					user_id: req.decoded._id,
					email: req.decoded.email,
					username: req.decoded.username,
				}
			}).toArray()

			if (!returnedValue[0]) { next() }
			else {
				return res.status(401).send({
					auth: false,
					error: 'Sorry man, you already voted!'
				})
			} 
		}
	}
}


// [EXPORT] //
module.exports = CommentMiddleware
