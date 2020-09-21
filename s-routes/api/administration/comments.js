/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION COMMENT ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const commentsCollection = require('../../../s-collections/commentsCollection')
const commentLikesCollection = require('../../../s-collections/commentLikesCollection')
const notificationsCollection = require('../../../s-collections/notificationsCollection')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ-ALL-ALL] //
router.get(
	'/read-all-all/:limit/:skip',
	Auth.adminToken(),
	async (req, res) => {
		if (
			Number.isInteger(parseInt(req.params.limit)) &&
			Number.isInteger(parseInt(req.params.skip))
		) {
			try {
				const returned = await commentsCollection.c_readAllAll(
					parseInt(req.params.skip),
					parseInt(req.params.limit)
				)
					
				res.status(200).send(returned)
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/administration/comments: Error --> ${err}`,
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: '/api/administration/comments: Invalid params'
			})
		}
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:comment_id',
	Auth.adminToken(),
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params.comment_id)) {
			try {
				const returned = await commentsCollection.c_adminDelete(
					req.params.comment_id
				)
				const returned2 = await commentLikesCollection.c_deleteAll(
					req.params.comment_id
				)
				const returned3 = await notificationsCollection.c_deleteAll(
					req.params.comment_id
				)

				res.status(200).send({
					executed: true,
					status: true,
					comment: returned,
					commentLikes: returned2,
					notifications: returned3,
				})

			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/administration/comments: Error --> ${err}`,
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: '/api/administration/comments: Invalid comment _id'
			})
		}
	}
)


// [EXPORT] //
module.exports = router