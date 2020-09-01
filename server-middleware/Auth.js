/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% AUTHORIZATION MIDDLEWARE %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const jwt = require('jsonwebtoken')


// [REQUIRE] Personal //
const banCollection = require('../server-collections/banCollection')
require('dotenv').config()


// [INIT] //
const secretKey = process.env.SECRET_KEY || 'secret'


class Auth {
	// [USER] //
	static userToken() {
		return (req, res, next) => {
			// Get Token from Header and remove "Bearer "
			const token = req.headers.authorization
			const tokenBody = token.slice(7)

			// If a token exists => Validate JWT //
			if (tokenBody !== 'undefined') {
				jwt.verify(tokenBody, secretKey, async (e, decoded) => {
					if (decoded) {
						let returned = ''
						req.decoded = decoded

						try {
							returned = await banCollection.c_existance(req.decoded._id)
							//console.log('Auth foundBan2:', returned)

						}
						catch (e) { console.log(`foundBan: Caught Error --> ${e}`) }


						next()
					}
					else {
						console.log(`JWT Error: ${e}`)

						res.status(200).send({
							status: false,
							message: 'Access Denied, Token Invalid.',
							auth: false,
						})
					}
				})
			}
			else {
				res.status(200).send({
					status: false,
					message: 'Access Denied, No Token Passed.',
					auth: false,
				})
			}
		}
	}


	// [USER] NOT rquired //
	static userTokenNotRequired() {
		return (req, res, next) => {
			// Get Token from Header and remove "Bearer "
			const token = req.headers.authorization
			const tokenBody = token.slice(7)

			// If a token exists => Validate JWT //
			if (tokenBody !== 'undefined') {
				jwt.verify(tokenBody, secretKey, async (e, decoded) => {
					if (decoded) { req.decoded = decoded }
					else { console.log('JWT Verify:', e) }
				})
			}
			
			// Since token is not required move on anyways
			next()
		}
	}


	// [ADMIN] //
	static adminToken() {
		return (req, res, next) => {
			// Get Token from Header and remove "Bearer "
			const token = req.headers.authorization2
			const tokenBody = token.slice(7)
			
			// If a token exists =>  Validate JWT //
			if (tokenBody !== 'undefined') {
				jwt.verify(tokenBody, secretKey, async (e, decoded) => {
					if (decoded) {
						// Check if the role is admin
						if (decoded.role == 'admin') { next() }
						else {
							res.status(200).send({
								status: false,
								message: 'Access Denied, Admin Token Needed',
								auth: false,
							})
						}
					}
					else {
						console.log(`Admin JWT Error: ${e}`)

						res.status(200).send({
							status: false,
							message: 'Access Denied, Invalid Token',
							auth: false,
						})
					}
				})
			}
			else {
				res.status(200).send({
					status: false,
					message: 'Access Denied, No Token Passed',
					auth: false,
				})
			}
		}
	}
}


// [EXPORT] //
module.exports = Auth
