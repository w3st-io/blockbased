/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% POST PAGE ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const commentsCollection = require('../../../s-collections/commentsCollection')
const postsCollection = require('../../../s-collections/postsCollection')
const postLikesCollection = require('../../../s-collections/postLikesCollection')
const postFollowersCollection = require('../../../s-collections/postFollowersCollection')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [READ-ALL] //
router.get(
	'/:limit/:page',
	Auth.userToken(),
	async (req, res) => {
		try {
			if (
				Number.isInteger(parseInt(req.params.page)) &&
				Number.isInteger(parseInt(req.params.limit))
			) {
				// [INIT] //
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit
				let posts = []

				// [COUNT] postFollowers //
				const totalFollows = (
					await postFollowersCollection.c_countAllUser(req.decoded.user_id)
				).count
				
				// [READ-ALL] postFollowers for user //
				const pfObj = await postFollowersCollection.c_readAllUser(
					req.decoded.user_id,
					skip,
					limit
				)

				for (let i = 0; i < pfObj.postFollowers.length; i++) {
					const postObj = await postsCollection.c_read(
						pfObj.postFollowers[i].post
					)
					
					if (postObj.status) {
						// [COUNT] Likes //
						postObj.post.likeCount = (
							await postLikesCollection.c_countAll(postObj.post._id)
						).count
			
						// [COUNT] Follows //
						postObj.post.followersCount = (
							await postFollowersCollection.c_countAll(postObj.post._id)
						).count

						// [COUNT] Comments //
						postObj.post.commentCount = (
							await commentsCollection.c_countAll(postObj.post._id)
						).count
		
						// [USER-LOGGED] //
						if (req.decoded) {
							// [LIKED-STATUS] //
							postObj.post.liked = (
								await postLikesCollection.c_existance(
									req.decoded.user_id,
									postObj.post._id
								)
							).existance
			
							// [FOLLOWED-STATUS] //
							postObj.post.followed = (
								await postFollowersCollection.c_existance(
									req.decoded.user_id,
									postObj.post._id
								)
							).existance
						}

						posts.push(postObj.post)
					}
					else { res.status(200).send(postObj) }
				}

				res.status(200).send({
					executed: true,
					status: true,
					posts: posts,
					totalFollows,
				})
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/pages/cat: Invalid Params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/pages/post/followed: Error --> ${err}`
			})
		}
	},
)
	
	
// [EXPORT] //
module.exports = router