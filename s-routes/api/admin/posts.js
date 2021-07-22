// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const activitiesCollection = require('../../../s-collections/activitiesCollection')
const commentsCollection = require('../../../s-collections/commentsCollection')
const commentLikesCollection = require('../../../s-collections/commentLikesCollection')
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
			if (validator.isAscii(req.params.post_id)) {
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

				// [DELETE] Activity (Post & Comment) //
				const activity = await activitiesCollection.c_deletePostActivity(
					req.params.post_id
				)

				// [DELETE-ALL] comments //
				const comments = await commentsCollection.c_deleteByPost(
					req.params.post_id
				)

				// [DELETE-ALL] comments //
				const commentLikes = await commentLikesCollection.c_deleteByPost(
					req.params.post_id
				)

				if (
					posts.status &&
					postLikes.status &&
					activity.status &&
					comments.status
				) {
					// [SUCCESS] //
					res.send({
						executed: true,
						status: true,
						deleted: [
							posts,
							postFollows,
							postLikes,
							activity,
							comments,
							commentLikes
						]
					})
				}

			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/admin/posts/delete',
					message: 'Invalid post_id'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/admin/posts/delete',
				message: `Caught Error --> ${err}`,
			})
		}
	}
)


module.exports = router