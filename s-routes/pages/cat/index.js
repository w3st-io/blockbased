/**
 * %%%%%%%%%%%%%%%%%%%%%%%
 * %%% CAT PAGE ROUTES %%%
 * %%%%%%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const postsCollection = require('../../../s-collections/postsCollection')
const postFollowsCollection = require('../../../s-collections/postFollowsCollection')
const postLikesCollection = require('../../../s-collections/postLikesCollection')
const commentsCollection = require('../../../s-collections/commentsCollection')
const cats = require('../../../s-defaults/cats')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/:cat_id/:sort/:limit/:page',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.params.cat_id) &&
				Number.isInteger(parseInt(req.params.sort)) &&
				Number.isInteger(parseInt(req.params.limit)) &&
				Number.isInteger(parseInt(req.params.page))
			) {
				// [INIT] //
				const sort = parseInt(req.params.sort)
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit

				// [READ-ALL] Sort //
				const postsObj = await postsCollection.c_readSortByCat(
					req.params.cat_id,
					sort,
					limit,
					skip,
				)

				if (postsObj.status) {
					// [PINNED] (1st Page Only) //
					if (pageIndex == 0) {
						const { posts: pinnedPosts } = await postsCollection.c_readPinned(
							req.params.cat_id
						)

						// For Each Pinned Post Insert It At the Beginning of Array //
						pinnedPosts.forEach(p => { postsObj.posts.unshift(p) })
					}

					// For Each Post in Posts //
					for (let i = 0; i < postsObj.posts.length; i++) {
						// [COUNT] Likes //
						postsObj.posts[i].likeCount = (
							await postLikesCollection.c_countAllByPost(postsObj.posts[i]._id)
						).count
						
						// [COUNT] Follows //
						postsObj.posts[i].followsCount = (
							await postFollowsCollection.c_countAll(postsObj.posts[i]._id)
						).count
						
						// [COUNT] Comments //
						postsObj.posts[i].commentCount = (
							await commentsCollection.c_countAllByPost(postsObj.posts[i]._id)
						).count
	
						// [USER-LOGGED] //
						if (req.decoded) {
							// [LIKED-STATUS] //
							postsObj.posts[i].liked = (
								await postLikesCollection.c_existance(
									req.decoded.user_id,
									postsObj.posts[i]._id
								)
							).existance
			
							// [FOLLOWED-STATUS] //
							postsObj.posts[i].followed = (
								await postFollowsCollection.c_existance(
									req.decoded.user_id,
									postsObj.posts[i]._id
								)
							).existance
						}
					}

					// [COUNT] Posts //
					postsObj.postsCount = (
						await postsCollection.c_countAllByCat(req.params.cat_id)
					).count
					
					// [COUNT] Calculate Pages //
					postsObj.pageCount = Math.ceil(postsObj.postsCount / limit)

					console.log('sdf', postsObj);
				}
				
				res.status(200).send({
					executed: true,
					status: true,
					cats: cats,
					postsObj: postsObj,
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
				message: `/pages/cat: Error --> ${err}`
			})
		}
	}
)


// [EXPORT] //
module.exports = router