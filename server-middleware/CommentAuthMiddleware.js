/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK AUTHORIZATION MIDDLEWARE %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
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
		return true
	}
}


// [EXPORT] //
module.exports = CommentAuthMiddleWare
