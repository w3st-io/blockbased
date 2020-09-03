/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% AUTHORIZATION MIDDLEWARE %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const jwt = require('jsonwebtoken')


// [REQUIRE] Personal //
const banCollection = require('../server-collections/banCollection')
const usersCollection = require('../server-collections/usersCollection')
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
				jwt.verify(tokenBody, secretKey, async (err, decoded) => {
					if (decoded) {
						let ban
						let verified
						req.decoded = decoded

						try {
							// Check verified //
							verified = await usersCollection.c_verifiedStatus(
								req.decoded._id
							)

							//console.log('Auth verified:', verified)
						}
						catch (err) { console.log(`Auth: Error --> ${err}`) }

						if (verified.status) {
							
							// Check Ban //
							try { ban = await banCollection.c_existance(req.decoded._id) }
							catch (err) { console.log(`Auth: Error --> ${err}`) }
							//console.log('Auth ban:', ban)
							
							
							next()
						}
						else { res.status(200).send(verified) }
					}
					else {
						console.log(`JWT Error: ${err}`)

						res.status(200).send({
							executed: true,
							status: false,
							message: 'Access denied, token invalid',
							auth: false,
						})
					}
				})
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: 'Access denied, no token passed',
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
				jwt.verify(tokenBody, secretKey, async (err, decoded) => {
					if (decoded) { req.decoded = decoded }
					else { console.log('JWT Verify:', err) }
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
				jwt.verify(tokenBody, secretKey, async (err, decoded) => {
					if (decoded) {
						// Check if the role is admin
						if (decoded.role == 'admin') { next() }
						else {
							res.status(200).send({
								executed: true,
								status: false,
								message: 'Access Denied, Admin Token Needed',
								auth: false,
							})
						}
					}
					else {
						console.log(`Admin JWT Error: ${err}`)

						res.status(200).send({
							executed: true,
							status: false,
							message: 'Access Denied, Invalid Token',
							auth: false,
						})
					}
				})
			}
			else {
				res.status(200).send({
					executed: true,
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
