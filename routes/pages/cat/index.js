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
const postsCollection = require('../../../server-collections/postsCollection')
const postFollowersCollection = require('../../../server-collections/postFollowersCollection')
const postLikesCollection = require('../../../server-collections/postLikesCollection')
const commentsCollection = require('../../../server-collections/commentsCollection')
const Auth = require('../../../server-middleware/Auth')


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
			validator.isAscii(req.params.skip) &&
			validator.isAscii(req.params.limit) &&
			validator.isAscii(req.params.sort)
		) {
			let returned = await postsCollection.c_readAllSort(
				req.params.cat_id,
				req.params.skip,
				req.params.limit,
				req.params.sort,
			)
			
			if (returned.status) {
				// For Each Post in Posts //
				for (let i = 0; i < returned.posts.length; i++) {
					// Like Count //
					const likeCount = await postLikesCollection.c_countAll(
						returned.posts[i]._id
					)
		
					if (likeCount.status) {
						returned.posts[i].likeCount = likeCount.count
					}	
					else { returned.posts[i].likeCount = likeCount.message }
		
					
					// Follow Count //
					const followersCount = await postFollowersCollection.c_countAll(
						returned.posts[i]._id
					)
					
					if (followersCount.status) {
						returned.posts[i].followersCount = followersCount.count
					}
					else { returned.posts[i].followersCount = followersCount.message }
		
					
					// Comment Count //
					const commentCount = await commentsCollection.c_countAll(
						returned.posts[i]._id
					)
					
					if (commentCount.status) {
						returned.posts[i].commentCount = commentCount.count
					}
					else { returned.posts[i].commentCount = commentCount.message }
		
					
					// Post Count //
					const postsCount = await postsCollection.c_countAll(req.params.cat_id)
		
					if (postsCount.status) {
						returned.postCount = postsCount.count
						
						// Page Count //
						returned.pageCount = Math.ceil(postsCount.count / req.params.limit)
					}
					else { returned.posts[i].postsCount = postsCount.message }


					// If User Token Passed.. //
					if (req.decoded) {
						// Liked Status //
						const liked = await postLikesCollection.c_existance(
							req.decoded._id,
							returned.posts[i]._id
						)
		
						if (liked.status) { returned.posts[i].liked = liked.existance }
						else { returned.posts[i].liked = liked.message }
		
						// Follwed Status //
						const followed = await postFollowersCollection.c_existance(
							req.decoded._id,
							returned.posts[i]._id
						)
						
						if (followed.status) {
							returned.posts[i].followed = followed.existance
						}
						else { returned.posts[i].followed = followed.message }
					}
				}
			}

			res.status(200).send(returned)
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'posts: Invalid Params'
			})
		}
	}
)


// [EXPORT] //
module.exports = router