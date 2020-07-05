/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongodb = require('mongodb')
require('dotenv').config()


// [REQUIRE] Personal //
const Collections = require('../../server-collections')
const Auth = require('../../server-middleware/AuthMiddleware')
const ReportsM = require('../../server-middleware/ReportsMiddleware')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userTokenCheck(),
	ReportsM.verifyNonExistance(),
	async (req, res) => {
		const reports = await Collections.loadReportsCollection()
		await reports.insertOne({
			createdAt: new Date(),
			block_id: req.body.block_id,
			comment_id: req.body.comment_id,
			type: req.body.reportType,
			user_id: req.decoded._id,
			email: req.decoded.email,
			username: req.decoded.username,
		})

		res.status(201).send({
			auth: true,
			message: 'Created Report'
		})
	}
)


// [EXPORT] //
module.exports = router