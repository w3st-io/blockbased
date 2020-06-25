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


class BlockAuthMiddleWare {
	/*
	static async verifyOwnership(block_id) {
		const blocks = await Collections.loadBlocksCollection()
		let retrievedData = await blocks.findOne(
			{ _id: new mongodb.ObjectID('5ef27e139d20424818f88dc3') }
		)
		
		console.log(blocks)
		console.log(retrievedData)
	}
	*/
}


// [EXPORT] //
module.exports = BlockAuthMiddleWare
