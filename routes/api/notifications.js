/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% NOTIFICATIONS ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
require('dotenv').config()


// [REQUIRE] Personal //
const notificationsCollection = require('../../server-collections/notificationsCollection')
const Auth = require('../../server-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ-ALL] //
router.get(
	'/read-all',
	Auth.userToken(),
	async (req, res) => {
		const returned = await notificationsCollection.c_readAll(req.decoded._id)

		res.status(200).send(returned)
	}
)


/******************* [MARK-READ-STATUS] *******************/
router.get(
	'/mark-read/:_id',
	Auth.userToken(),
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params._id)) {
			const returned = await notificationsCollection.c_markRead(
				req.params._id
			)

			res.status(200).send(returned)
		}
		else { res.status(200).send({ status: false, message: 'Invalid block_id' }) }
	}
)


// [EXPORT] //
module.exports = router