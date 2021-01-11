// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const commentsCollection = require('../../s-collections/commentsCollection')
const postsCollection = require('../../s-collections/postsCollection')
const postFollowsCollection = require('../../s-collections/postFollowsCollection')
const postLikesCollection = require('../../s-collections/postLikesCollection')
const Auth = require('../../s-middleware/Auth')
const cats = require('../../s-defaults/cats')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		try {
			for (let i = 0; i < cats.length; i++) {
				// [TOTAL-POSTS] //
				cats[i].totalPosts = (
					await postsCollection.c_countByCat(cats[i].cat_id)
				).count

				// [RECENT-POST] //
				cats[i].recentPost = (
					await postsCollection.c_readByCatSorted(cats[i].cat_id, 0, 1, 0)
				).posts[0]

			}
			
			// [TOP-POSTS] //
			const topPosts = (
				await postsCollection.c_readSorted(1, 5, 0)
			).posts

			// For Each Post in Top Post //
			for (let i = 0; i < topPosts.length; i++) {
				// [COUNT] Likes //
				topPosts[i].likeCount = (
					await postLikesCollection.c_countByPost(topPosts[i]._id)
				).count
				
				// [COUNT] Follows //
				topPosts[i].followsCount = (
					await postFollowsCollection.c_countByPost(topPosts[i]._id)
				).count
				
				// [COUNT] Comments //
				topPosts[i].commentCount = (
					await commentsCollection.c_countByPost(topPosts[i]._id)
				).count

				// [USER-LOGGED] //
				if (req.decoded) {
					// [LIKED-STATE] //
					topPosts[i].liked = (
						await postLikesCollection.c_existance(
							req.decoded.user_id,
							topPosts[i]._id
						)
					).existance
	
					// [FOLLOWED-STATE] //
					topPosts[i].followed = (
						await postFollowsCollection.c_existance(
							req.decoded.user_id,
							topPosts[i]._id
						)
					).existance
				}
			}

			
			res.send({
				executed: true,
				status: true,
				cats: cats,
				topPosts: topPosts,
			})
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/pages: Error --> ${err}`
			})
		}
	}
)


// [EXPORT] //
module.exports = router