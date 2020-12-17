/**
 * %%%%%%%%%%%%%%%%%%%
 * %%% USER ROUTES %%%
 * %%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const usersCollection = require('../../../../s-collections/usersCollection')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/
// [READ] Params //
router.get(
	'/:user_id',
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (mongoose.isValidObjectId(req.params.user_id)) {
				const userObj = await usersCollection.c_readSensitive(req.params.user_id)

				res.status(200).send(userObj)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: 'Invalid user _id'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/pages/user/profile/view: Error --> ${err}`
			})
		}
	}
)


// [EXPORT] //
module.exports = router