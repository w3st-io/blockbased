/**
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK VOTES ROUTE %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const express = require('express')
const mongodb = require('mongodb')


// [REQUIRE] Personal //
require('dotenv').config()


// [INIT] //
const router = express.Router()


/******************* [CRUD] *******************/
// [CREATE] //
router.post('/create', async (req, res) => {
	const blocksVotes = await loadBlockVotesCollection()

	await blocksVotes.insertOne({
		createdAt: new Date(),
		block_id: req.body.block_id,
		user_id: req.body.user_id,
		email: req.body.email,
		username: req.body.username,
	})

	res.status(201).send()
})


// [DELETE] //
router.delete('/delete/:id', async (req, res) => {
	const blocksVotes = await loadBlockVotesCollection()
	
	await blocksVotes.deleteOne(
		{ _id: new mongodb.ObjectID(req.params.id) }
	)

	res.status(200).send()
})


/*** [LOAD COLLECTION] blockVotes ***/
async function loadBlockVotesCollection() {
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'db_name'
	const c_name = 'blockVotes'
	
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