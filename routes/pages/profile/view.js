/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% USER ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const usersCollection = require('../../../server-collections/usersCollection')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/
// [READ] Params //
router.get(
	'/:_id',
	async (req, res) => {
		// [VALIDATE] //
		if (mongoose.isValidObjectId(req.params._id)) {
			const returned = await usersCollection.c_read(req.params._id)

			res.status(200).send(returned)
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'Invalid user _id'
			})
		}
	}
)


// [EXPORT] //
module.exports = router