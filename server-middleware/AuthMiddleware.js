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
	static userCheck() {
		return (req, res, next) => {
			// Get Token from Header and remove "Bearer "
			const token = req.headers.authorization

			// If a token exists =>  Validate JWT //
			if (token) {
				const TokenBody = token.slice(7)
				jwt.verify(TokenBody, secretKey, (err, decoded) => {
					if (decoded) { next() }
					else {
						console.log(`JWT Error: ${err}`)
						return res.status(401).send({
							auth: false,
							error: 'Access Denied, Admin Token Needed'
						})
					}
				})
			}
			else { return res.status(401).
				send({
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
}


// [EXPORT] //
module.exports = AuthMiddleWare
