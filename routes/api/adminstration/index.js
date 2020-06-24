/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongodb = require('mongodb')


// [REQUIRE] Personal //
require('dotenv').config()


// [INIT] //
const router = express.Router().use(cors())


/******************* [LOAD COLLECTION] blocks *******************/
async function loadBlocksCollection() {
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'db_name'
	const c_name = 'blocks'
	
	const client = await mongodb.MongoClient.connect(
		uri,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}	
	)

	return client.db(db_name).collection(c_name)
}

// [EXPORT] //
module.exports = router