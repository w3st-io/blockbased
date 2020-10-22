/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
 * %%% ADMINISTRATION POSTS ROUTES %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const activitiesCollection = require('../../../s-collections/activitiesCollection')
const postsCollection = require('../../../s-collections/postsCollection')
const postFollowsCollection = require('../../../s-collections/postFollowsCollection')
const postLikesCollection = require('../../../s-collections/postLikesCollection')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ-ALL-ALL] Auth Required //
router.post(
	'/read-all-all/:page',
	Auth.adminToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				Number.isInteger(parseInt(req.params.page)) &&
				Number.isInteger(parseInt(req.body.limit))
			) {
				// [INIT] //
				const pageIndex = parseInt(req.params.page) - 1
				const limit = parseInt(req.body.limit)
				const skip = pageIndex * limit


				const returned = await postsCollection.c_readAllAll(limit, skip)
	
				res.status(200).send(returned)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/administration/posts: Invalid params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/administration/posts: Error --> ${err}`,
			})
		}
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:post_id',
	Auth.adminToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (mongoose.isValidObjectId(req.params.post_id)) {
				// [DELETE] posts //
				const posts = await postsCollection.c_delete(req.params.post_id)

				// [DELETE] postFollows //
				const postFollows = await postFollowsCollection.c_deleteAll(
					req.params.post_id
				)

				// [DELETE] postLikes //
				const postLikes = await postLikesCollection.c_deleteAll(
					req.params.post_id
				)

				// [DELETE] Activity //
				const activty = await activitiesCollection.c_deletePostActivity(
					req.params.post_id
				)

				res.sendStatus(200).send({
					executed: true,
					status: true,
					deleted: [posts, postFollows, postLikes, activty]
				})
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/administration/posts: Invalid post_id'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/administration/posts: Error --> ${err}`,
			})
		}
	}
)


// [EXPORT] //
module.exports = router