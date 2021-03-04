// [REQUIRE] //
const jwt = require('jsonwebtoken')
const validator = require('validator')


// [REQUIRE] Personal //
const config = require('../s-config')
const usersCollection = require('../s-collections/usersCollection')


// [INIT] //
const secretKey = config.SECRET_KEY


class Auth {
	// [USER-MANAGER-TOKEN] //
	static userManagerToken() {
		return (req, res, next) => {
			// [INIT] //
			const token = req.headers.authorization

			// If a token exists =>  Validate JWT //
			if (token) {
				// [SLICE] "Bearer " //
				const tokenBody = token.slice(7)

				if (validator.isJWT(tokenBody)) {
					// [VERIFY] tokenBody //
					jwt.verify(tokenBody, secretKey, async (err, decoded) => {
						if (decoded) {

							// [INIT] Put decoded in req //
							req.decoded = decoded
							
							// Check verified //
							const verified = await usersCollection.c_verifiedStatus(
								req.decoded.user_id
							)

							if (verified.status) {
								// Check if the role is admin
								if (decoded.role == 'manager') { next() }
								else {
									res.status(200).send({
										executed: true,
										status: false,
										message: 'Access Denied: You must be manager',
										auth: false,
									})
								}
							}
							else { res.status(200).send(verified) }
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
}


// [EXPORT] //
module.exports = Auth
