// [REQUIRE] //
const jwt = require('jsonwebtoken')
const validator = require('validator')


// [REQUIRE] Personal //
const config = require('../s-config')
const bansCollection = require('../s-collections/bansCollection')
const usersCollection = require('../s-collections/usersCollection')


// [INIT] //
const secretKey = config.SECRET_KEY


class Auth {
	/******************* [ADMIN] *******************/
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


	// [USER-TOKEN] NOT required //
	static adminTokenNotRequired() {
		return async (req, res, next) => {
			if (req.headers.authorization2) {
				// [SLICE] "Bearer " //
				const tokenBody = req.headers.authorization2.slice(7)

				if (tokenBody !== 'undefined') {
					// Validate JWT //
					try {
						const decoded = await jwt.verify(tokenBody, secretKey)

						// Check if the role is admin
						if (decoded.role == 'admin') { req.decoded2 = decoded }
						else {
							res.status(200).send({
								executed: true,
								status: false,
								message: 'Access Denied: Invalid Token',
								auth: false,
							})
						}
					}
					catch (err) { console.log('JWT Verify:', err) }
					
				}
			}
			else { console.log('no req.headers.authorization') }
			
			// Since token is not required move on anyways
			next()
		}
	}


	/******************* [USER] *******************/
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
						try {
							if (decoded) {
								// [INIT] Put decoded in req //
								req.decoded = decoded

								// Check verified //
								const verified = await usersCollection.c_verifiedStatus(
									req.decoded.user_id
								)

								if (verified.status) {
									// Check Ban //
									const ban = await bansCollection.c_existance(
										req.decoded.user_id
									)
									
									next()
								}
								else { res.status(200).send(verified) }
							}

							else {
								res.status(200).send({
									executed: true,
									status: false,
									message: `Access denied: JWT Error --> ${err}`,
									auth: false,
								})
							}
						}
						catch (err) {
							res.status(200).send({
								executed: false,
								status: false,
								message: `Auth: Error --> ${err}`
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
	

	// [USER-TOKEN] Verification NOT required //
	static userTokenByPassVerification() {
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

							try { next() }
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


	// [USER-TOKEN] NOT required //
	static userTokenNotRequired() {
		return async (req, res, next) => {
			// [INIT] //
			const token = req.headers.authorization

			if (token) {
				// [SLICE] "Bearer " //
				const tokenBody = token.slice(7)

				// If a token exists => Validate JWT //
				if (tokenBody !== 'undefined') {
					try {
						const decoded = await jwt.verify(tokenBody, secretKey)
						
						// [INIT] Put decoded in req //
						req.decoded = decoded
					}
					catch (err) {
						console.log('JWT Verify:', err)

						res.status(200).send({
							executed: true,
							status: false,
							message: err
						})
					}
				}
			}
			
			// Since token is not required move on anyways
			next()
		}
	}
}


// [EXPORT] //
module.exports = Auth
