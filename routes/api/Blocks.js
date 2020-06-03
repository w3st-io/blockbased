/**
 * %%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCKS ROUTE %%% *
 * %%%%%%%%%%%%%%%%%%%% *
*/
/*** [REQUIRE] ***/
const express = require('express')
const mongodb = require('mongodb')

/*** [REQUIRE] Personal ***/
require('dotenv').config()

/*** [INIT] ***/
const router = express.Router()

// [READ] Get Comment IDs for Specicifc Post ID //
router.get('/comment-id/read-all/:block_id', async (req, res) => {
	const blocksXComments = await loadBlocksXCommentsCollection()
	let retrievedData = await blocksXComments.find(
		{ block_id: req.params.block_id }
	).toArray()

	// [RES SEND] //
	res.send(retrievedData)
})

/*** [FUNCTION] Post-single Collection in Database ***/
async function loadBlocksXCommentsCollection() {
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'blockbased'
	const c_name = 'blocksXComments'
	
	const client = await mongodb.MongoClient.connect(
		uri,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)

	// [RETURN] //
	return client.db(db_name).collection(c_name)
}

/*** [EXPORT] ***/
module.exports = router