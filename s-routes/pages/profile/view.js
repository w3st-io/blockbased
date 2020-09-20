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
const usersCollection = require('../../../s-collections/usersCollection')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/
// [READ] Params //
router.get(
	'/:_id',
	async (req, res) => {
		// [VALIDATE] //
		if (mongoose.isValidObjectId(req.params._id)) {
			try {
				const returned = await usersCollection.c_read(req.params._id)

				res.status(200).send(returned)
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/pages/profile/view: Error --> ${err}`
				})
			}
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