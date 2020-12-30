/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
 * %%% ADMINISTRATION REPORTS ROUTES %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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
// [DELETE] Auth Required //
router.delete(
	'/delete/:commentReport_id',
	Auth.adminToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (mongoose.isValidObjectId(req.params.commentReport_id)) {
				const returned = await commentReportsCollection.c_delete(
					req.params.commentReport_id
				)
				
				res.status(200).send(returned)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/administration/comment-reports: Invalid commentReport_id'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/administration/comment-reports: Error --> ${err}`,
			})
		}
	}
)


/******************* [OTHER-CRUD] *******************/
// [READ-ALL] Unhandled //
router.get(
	'/read-unhandled/:limit/:skip',
	Auth.adminToken(),
	async (req, res) => {
		try {
			const returned = await commentReportsCollection.c_readUnhandled(
				req.params.limit,
				req.params.skip
			)
			
			res.status(200).send(returned)
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/administration/comment-reports: Error --> ${err}`,
			})
		}
	}
)


/******************* [MARK-HANDLED-STATUS] *******************/
router.get(
	'/mark-handled/:commentReport_id',
	Auth.userToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (mongoose.isValidObjectId(req.params.commentReport_id)) {
				const returned = await commentReportsCollection.c_markHandled(
					req.params.commentReport_id
				)

				res.status(200).send(returned)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: 'Invalid commentReport_id'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/administration/comment-reports: Error --> ${err}`,
			})
		}
	}
)


// [EXPORT] //
module.exports = router