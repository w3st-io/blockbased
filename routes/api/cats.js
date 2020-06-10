/**
 * %%%%%%%%%%%%%%%%%% *
 * %%% CATS ROUTE %%% *
 * %%%%%%%%%%%%%%%%%% *
*/
/*** [REQUIRE] ***/
const express = require('express')
const mongodb = require('mongodb')

/*** [REQUIRE] Personal ***/
require('dotenv').config()

/*** [INIT] ***/
const router = express.Router()



/*** [LOAD COLLECTION] blocks ***/
async function loadCatsCollection() {
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'db_name'
	const c_name = 'cats'
	
	const client = await mongodb.MongoClient.connect(
		uri,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)

	return client.db(db_name).collection(c_name)
}

/*** [EXPORT] ***/
module.exports = router