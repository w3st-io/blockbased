/**
 * %%%%%%%%%%%%%%%%%%%%%%% *
 * %%% CAT PAGE ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')
require('dotenv').config()


// [REQUIRE] Personal //
const postsCollection = require('../../../s-collections/postsCollection')
const postFollowersCollection = require('../../../s-collections/postFollowersCollection')
const postLikesCollection = require('../../../s-collections/postLikesCollection')
const commentsCollection = require('../../../s-collections/commentsCollection')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ-ALL] Within Cat //
router.get(
	'/:cat_id/:limit/:skip/:sort',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		// [VALIDATE] //
		if (
			validator.isAscii(req.params.cat_id) &&
			Number.isInteger(parseInt(req.params.skip)) &&
			Number.isInteger(parseInt(req.params.limit)) &&
			validator.isAscii(req.params.sort)
		) {
			let postsObj

			try {
				postsObj = await postsCollection.c_readAllSort(
					req.params.cat_id,
					parseInt(req.params.skip),
					parseInt(req.params.limit),
					req.params.sort,
				)

				if (postsObj.status) {
					// [POST-COUNT] //
					postsObj.postsCount = (
						await postsCollection.c_countAll(req.params.cat_id)
					).count
					
					// [PAGE-COUNT] //
					postsObj.pageCount = Math.ceil(postsObj.postsCount / req.params.limit)
	
					// For Each Post in Posts //
					for (let i = 0; i < postsObj.posts.length; i++) {
						// [LIKE-COUNT] //
						postsObj.posts[i].likeCount = (
							await postLikesCollection.c_countAll(postsObj.posts[i]._id)
						).count
						
						// [FOLLOW-COUNT] //
						postsObj.posts[i].followersCount = (
							await postFollowersCollection.c_countAll(postsObj.posts[i]._id)
						).count
						
						// [COMMENT-COUNT] //
						postsObj.posts[i].commentCount = (
							await commentsCollection.c_countAll(postsObj.posts[i]._id)
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
								await postFollowersCollection.c_existance(
									req.decoded.user_id,
									postsObj.posts[i]._id
								)
							).existance
						}
					}
				}

				res.status(200).send(postsObj)
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/pages/cat: Error --> ${err}`
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: '/pages/cat: Invalid Params'
			})
		}
	}
)


// [EXPORT] //
module.exports = router