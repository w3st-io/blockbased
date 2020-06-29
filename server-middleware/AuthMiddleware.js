/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% AUTHORIZATION MIDDLEWARE %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 */
// [REQUIRE] //
const jwt = require('jsonwebtoken')


// [REQUIRE] Personal //
require('dotenv').config()


// [INIT] //
const secretKey = process.env.SECRET_KEY || 'secret'


class AuthMiddleWare {
	// [USER] //
	static userTokenCheck() {
		return (req, res, next) => {
			// Get Token from Header and remove "Bearer "
			const token = req.headers.authorization

			// If a token exists =>  Validate JWT //
			if (token) {
				const TokenBody = token.slice(7)
				jwt.verify(TokenBody, secretKey, (err, decoded) => {
					if (decoded) {
						req.decoded = decoded
						next()
					}
					else {
						console.log(`JWT Error: ${err}`)
						return res.status(401).send({
							auth: false,
							error: 'Access Denied, Token Invalid'
						})
					}
				})
			}
			else {
				return res.status(401).send({
					auth: false,
					error: 'Access Denied, No Token Passed'
				})
			}
		}
	}


	// [ADMIN] //
	static adminCheck() {
		return (req, res, next) => {
			// Get Token from Header and remove "Bearer "
			const token = req.headers.authorization2
			
			// If a token exists =>  Validate JWT //
			if (token) {
				const TokenBody = token.slice(7)
				jwt.verify(TokenBody, secretKey, (err, decoded) => {
					if (decoded) {
						// Check if the role is admin
						if (decoded.role == 'admin') { next() }
						else {
							return res.status(401).send({
								auth: false,
								error: 'Access Denied, Admin Token Needed'
							})
						}
					}
					// [ERR] //
					else {
						console.log(`Admin JWT Error: ${err}`)
						return res.status(401).send({
							error: 'Access Denied, Invalid Token'
						})
					}
				})
			}
			else {
				return res.status(401).send({
					auth: false,
					error: 'Access Denied, No Token Passed'
				})
			}
		}
	}

	static bodyIdVsDecodedId() {
		return (req, res, next) => {
			//console.log('req.body.user_id:', req.body.user_id)
			//console.log('req.decoded._id:', req.decoded._id)

			if (req.body.user_id == req.decoded._id) { next() }
			else {
				res.status(401).send({
					auth: false,
					error: 'body.user_id Does not match decoded._id'
				})
			}
		}
	}
}


// [EXPORT] //
module.exports = AuthMiddleWare
