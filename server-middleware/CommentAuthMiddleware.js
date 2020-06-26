/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK AUTHORIZATION MIDDLEWARE %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * 
 * !!!!!!!BROKEN!!!!!!!
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
	static verifyOwnership(token, comment_id) {
		// Get Decoded Data and Delete Comment Decoded user_id //
		jwt.verify(token, secretKey, async (err, decoded) => {
			if (decoded) {
				return new Promise (async (resolve, reject) => {
					const comments = await Collections.loadCommentsCollection()
					let r = await comments.findOne(
						{
							_id: new mongodb.ObjectID(comment_id),
							user_id: decoded._id,
						}
					)

					console.log('rrr', r)

					if (r) { resolve(r)  }
					else { reject('f') }
				})
			}
			else { console.log (err); return }
		})


	}

	static test() {
		return async (req, res, next) => {
			// Get Token from Header and remove "Bearer "
			const token = req.headers.authorization

			// If a token exists =>  Validate JWT //
			if (token) {
				const TokenBody = token.slice(7)
				jwt.verify(TokenBody, secretKey, (err, decoded) => {
					if(decoded) {
						console.log(decoded, decoded._id)
						id = decoded._id
					}
					else { console.log('err:', err) }
				})
				
				const comments = await Collections.loadCommentsCollection()
				let data = await comments.findOne(
					{
						_id: new mongodb.ObjectID(req.params._id),
						user_id: ''
					}
				)

				console.log('data:', data)
				if (data) { next() }

				else {
					console.log('failed')
					return res.status(401).send("Failed")
				}
			}
		}
	}
}


// [EXPORT] //
module.exports = CommentAuthMiddleWare
