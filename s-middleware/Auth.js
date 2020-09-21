const e = require('express')
/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% AUTHORIZATION MIDDLEWARE %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const jwt = require('jsonwebtoken')
const validator = require('validator')


// [REQUIRE] Personal //
const banCollection = require('../s-collections/banCollection')
const usersCollection = require('../s-collections/usersCollection')
require('dotenv').config()


// [INIT] //
const secretKey = process.env.SECRET_KEY || 'secret'


class Auth {
	// [USER-TOKEN] //
	static userToken() {
		return (req, res, next) => {
			// [INIT] //
			const token = req.headers.authorization	

			// If a token exists => Validate JWT //
			if (token) {
				// [SLICE] "Bearer " //
				const tokenBody = token.slice(7)

				if (validator.isJWT(tokenBody)) {
					// [VERIFY] tokenBody //
					jwt.verify(tokenBody, secretKey, async (err, decoded) => {
						if (decoded) {
							// [INIT] Put decoded in req //
							req.decoded = decoded

							try {
								// Check verified //
								const verified = await usersCollection.c_verifiedStatus(
									req.decoded.user_id
								)

								if (verified.status) {
									// Check Ban //
									const ban = await banCollection.c_existance(
										req.decoded.user_id
									)

									next()
								}
								else { res.status(200).send(verified) }
							}
							catch (err) {
								res.status(200).send({
									executed: false,
									status: false,
									message: `Auth: Error --> ${err}`
								})
							}
						}
						else {
							res.status(200).send({
								executed: true,
								status: false,
								message: `Access denied: JWT Error --> ${err}`,
								auth: false,
							})
						}
					})
				}
				else {
					res.status(200).send({
						executed: true,
						status: false,
						message: 'Access denied: Not valid JWT',
						auth: false,
					})
				}
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: 'Access denied: No token passed',
					auth: false,
				})
			}
		}
	}


	// [ADMIN-TOKEN] //
	static adminToken() {
		return (req, res, next) => {
			// [INIT] //
			const token = req.headers.authorization2

			// If a token exists =>  Validate JWT //
			if (token) {
				// [SLICE] "Bearer " //
				const tokenBody = token.slice(7)

				if (validator.isJWT(tokenBody)) {
					// [VERIFY] tokenBody //
					jwt.verify(tokenBody, secretKey, async (err, decoded) => {
						if (decoded) {
							// [INIT] Put decoded in req //
							req.decoded2 = decoded

							// Check if the role is admin
							if (decoded.role == 'admin') { next() }
							else {
								res.status(200).send({
									executed: true,
									status: false,
									message: 'Access Denied: Invalid Token',
									auth: false,
								})
							}
						}
						else {
							res.status(200).send({
								executed: true,
								status: false,
								message: `Access Denied: JWT Error --> ${err}`,
								auth: false,
							})
						}
					})
				}
				else {
					res.status(200).send({
						executed: true,
						status: false,
						message: 'Access denied: Not valid JWT',
						auth: false,
					})
				}
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: 'Access denied: No token passed',
					auth: false,
				})
			}
		}
	}


	// [USER-TOKEN] NOT rquired //
	static userTokenNotRequired() {
		return (req, res, next) => {
			// [INIT] //
			const token = req.headers.authorization

			if (token) {
				// [SLICE] "Bearer " //
				const tokenBody = token.slice(7)

				// If a token exists => Validate JWT //
				if (tokenBody !== 'undefined') {
					jwt.verify(tokenBody, secretKey, async (err, decoded) => {
						if (decoded) {
							// [INIT] Put decoded in req //
							req.decoded = decoded
						}
						else { console.log('JWT Verify:', err) }
					})
				}
			}
			
			// Since token is not required move on anyways
			next()
		}
	}
}


// [EXPORT] //
module.exports = Auth
