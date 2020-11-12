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
const commentsCollection = require('../../../s-collections/commentsCollection')
const postsCollection = require('../../../s-collections/postsCollection')
const postFollowsCollection = require('../../../s-collections/postFollowsCollection')
const postLikesCollection = require('../../../s-collections/postLikesCollection')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [DELETE] Auth Required //
router.delete(
	'/delete/:post_id',
	Auth.adminToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (mongoose.isValidObjectId(req.params.post_id)) {
				//// [POSTS] ////
				// [DELETE] posts //
				const posts = await postsCollection.c_delete(req.params.post_id)

				// [DELETE] postFollows //
				const postFollows = await postFollowsCollection.c_deleteByPost(
					req.params.post_id
				)

				// [DELETE-ALL] postLikes //
				const postLikes = await postLikesCollection.c_deleteByPost(
					req.params.post_id
				)

				// [DELETE] Activity //
				const activity = await activitiesCollection.c_deletePostActivity(
					req.params.post_id
				)

				// [DELETE-ALL] comments //
				const comments = await commentsCollection.c_deleteByPost(
					req.params.post_id
				)

				if (
					posts.status &&
					postLikes.status &&
					activity.status &&
					comments.status
				) {
					// [SUCCESS] //
					res.status(200).send({
						executed: true,
						status: true,
						deleted: [posts, postFollows, postLikes, activity, comments]
					})
				}

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
			console.log('caught error', err)
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