/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% AUTHORIZATION MIDDLEWARE %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 */
// [REQUIRE] //
const jwt = require("jsonwebtoken")


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
			const TokenBody = token.slice(7)

			// If a token exists =>  Validate JWT //
			if (TokenBody) {
				jwt.verify(TokenBody, secretKey, (err, decoded) => {
					if (decoded) { next() }
					else {
						console.log(`JWT Error: ${err}`)
						return res.status(401).send("Error: Access Denied, Invalid Token")
					}
				})
			}
			else { return res.status(401).send("No Token, Access Denied") }
		}
	}


	// [ADMIN] //
	static adminCheck() {
		return (req, res, next) => {
			// Get JWT in Headers
			const token = req.headers.jwt_token
			
			// If a token exists =>  Validate JWT //
			if (token) {
				jwt.verify(token, secretKey, (err, decoded) => {
					// [DECODED] //
					if (decoded) {
						// Check if the role is admin
						if (decoded.role == 'admin') { next() }
						else { return res.status(401).send("Error: Access Denied, Invalid Crendentials") }
					}
					// [ERR] //
					else {
						console.log(`JWT Error: ${err}`)
						return res.status(401).send("Error: Access Denied, Invalid Token")
					}
				})
			}
			else { return res.status(401).send("No Token, Access Denied") }
		}
	}
}


// [EXPORT] //
module.exports = AuthMiddleWare
