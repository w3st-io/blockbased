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


class AuthMiddleware {
	// [USER] //
	static userToken() {
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

						res.status(401).send({
							status: true,
							message: 'Access Denied, Token Invalid.',
							auth: false,
						})
					}
				})
			}
			else {
				res.status(401).send({
					status: true,
					message: 'Access Denied, No Token Passed.',
					auth: false,
				})
			}
		}
	}


	// [ADMIN] //
	static adminToken() {
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
							res.status(401).send({
								status: true,
								message: 'Access Denied, Admin Token Needed',
								auth: false,
							})
						}
					}
					else {
						console.log(`Admin JWT Error: ${err}`)

						res.status(401).send({
							status: true,
							message: 'Access Denied, Invalid Token',
							auth: false,
						})
					}
				})
			}
			else {
				res.status(401).send({
					status: true,
					message: 'Access Denied, No Token Passed',
					auth: false,
				})
			}
		}
	}
}


// [EXPORT] //
module.exports = AuthMiddleware
