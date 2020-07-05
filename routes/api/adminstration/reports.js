/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINSTRATION REPORTS ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongodb = require('mongodb')
require('dotenv').config()


// [REQUIRE] Personal //
const Auth = require('../../../server-middleware/AuthMiddleware')
const Collections = require('../../../server-collections')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ ALL] Auth Required //
router.get(
	'/read-all',
	Auth.adminCheck(),
	async (req, res) => {
		const reports = await Collections.loadReportsCollection()
		let retrievedData = await reports.find().toArray()

		res.send(retrievedData)
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.adminCheck(),
	async (req, res) => {
		let validId = mongodb.ObjectID.isValid(req.params._id)

		if (validId) {
			const reports = await Collections.loadReportsCollection()
			await reports.deleteOne(
				{ _id: new mongodb.ObjectID(req.params._id) }
			)

			res.status(201).send()
		}
		else { res.sendStatus(400) }
	}
)


// [EXPORT] //
module.exports = router