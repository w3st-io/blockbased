/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION REPORTS ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const commentReportsCollection = require('../../../s-collections/commentReportsCollection')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ-ALL] Auth Required //
router.get(
	'/read-all',
	Auth.adminToken(),
	async (req, res) => {
		try {
			const returned = await commentReportsCollection.c_readAll()

			res.status(200).send(returned)
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/administration/reports: Error --> ${err}`,
			})
		}
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:report_id',
	Auth.adminToken(),
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params.report_id)) {
			try {
				const returned = await commentReportsCollection.c_delete(
					req.params.report_id
				)
				
				res.status(200).send(returned)
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/administration/reports: Error --> ${err}`,
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: '/api/administration/reports: Invalid report _id'
			})
		}
	}
)


// [EXPORT] //
module.exports = router