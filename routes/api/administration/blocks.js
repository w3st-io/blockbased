/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION BLOCK ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const aBlocksCollection = require('../../../server-collections/administration/blocksCollection')
const blockLikesCollection = require('../../../server-collections/blockLikesCollection')
const Auth = require('../../../server-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ-ALL-ALL] Auth Required //
router.get(
	'/read-all-all/:amount/:skip',
	Auth.adminToken(),
	async (req, res) => {
		const returned = await aBlocksCollection.c_readAllAll(
			req.params.skip,
			req.params.amount
		)

		res.status(200).send(returned)
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.adminToken(),
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params._id)) {
			aBlocksCollection.c_delete(req.params._id)
			blockLikesCollection.c_deleteAll(req.params._id)

			res.sendStatus(200)
		}
		else {
			res.status(200).send({
				status: false,
				message: 'a blocks: Invalid _id'
			})
		}
	}
)


// [EXPORT] //
module.exports = router