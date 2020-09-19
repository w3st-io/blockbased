/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION BLOCK ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const postsCollection = require('../../../s-collections/postsCollection')
const postLikesCollection = require('../../../s-collections/postLikesCollection')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ-ALL-ALL] Auth Required //
router.get(
	'/read-all-all/:limit/:skip',
	Auth.adminToken(),
	async (req, res) => {
		if (
			Number.isInteger(parseInt(req.params.limit)) &&
			Number.isInteger(parseInt(req.params.skip))
		) {
			try {
				const returned = await postsCollection.c_readAllAll(
					parseInt(req.params.skip),
					parseInt(req.params.limit)
				)
	
				res.status(200).send(returned)
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/administration/posts: Error --> ${err}`,
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: '/api/administration/posts: Invalid params'
			})
		}
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.adminToken(),
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params._id)) {
			try {
				await postsCollection.c_delete(req.params._id)
				await postLikesCollection.c_deleteAll(req.params._id)

				res.sendStatus(200)
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/administration/posts: Error --> ${err}`,
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: '/api/administration/posts: Invalid post _id'
			})
		}
	}
)


// [EXPORT] //
module.exports = router