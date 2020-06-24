/**
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK VOTE ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongodb = require('mongodb')


// [REQUIRE] Personal //
const Auth = require('../../server-middleware/AuthMiddleware')
require('dotenv').config()


// [INIT] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post('/create', Auth.userCheck(), async (req, res) => {
	const blockVotes = await loadBlockVotesCollection()
	await blockVotes.insertOne({
		createdAt: new Date(),
		block_id: req.body.block_id,
		user_id: req.body.user_id,
		email: req.body.email,
		username: req.body.username,
	})

	res.status(201).send()
})


// [DELETE] Auth Required //
router.delete('/delete/:user_id/:block_id', Auth.userCheck(), async (req, res) => {
	const blockVotes = await loadBlockVotesCollection()
	await blockVotes.deleteMany({
		block_id: req.params.block_id,
		user_id: req.params.user_id,
	})

	res.status(200).send()
})


/******************* [LOAD COLLECTION] blockVotes *******************/
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