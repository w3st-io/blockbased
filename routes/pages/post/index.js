/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
 * this MUST have nested if's due to error if none
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const validator = require('validator')
require('dotenv').config()


// [REQUIRE] Personal //
const rateLimiter = require('../../../rate-limiters')
const postsCollection = require('../../../server-collections/postsCollection')
const postFollowersCollection = require('../../../server-collections/postFollowersCollection')
const commentsCollection = require('../../../server-collections/commentsCollection')
const commentLikesCollection = require('../../../server-collections/commentLikesCollection')
const commentReportsCollection = require('../../../server-collections/commentReportsCollection')
const notificationsCollection = require('../../../server-collections/notificationsCollection')
const Auth = require('../../../server-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [COMMENT] *******************/
// [READ-ALL] //
router.get(
	'/:post_id/:limit/:skip',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		// [VALIDATE] //
		if (
			mongoose.isValidObjectId(req.params.post_id) &&
			validator.isAscii(req.params.limit) &&
			validator.isAscii(req.params.skip)
		) {
			const postExistance = await postsCollection.c_existance(req.params.post_id)

			if (postExistance.existance) {
				const returned = await commentsCollection.c_readAll(
					req.params.post_id,
					req.params.skip,
					req.params.limit
				)
				
				if (returned.status) {
					// For Each Post in Posts //
					for (let i = 0; i < returned.comments.length; i++) {
						try {
							// Set Like Count //
							const count = await commentLikesCollection.c_countAll(
								returned.comments[i]._id
							)
		
							returned.comments[i].likeCount = count.count
						}
						catch (err) { console.log(`comments: Error --> ${err}`) }
		
						if (req.decoded) {
							try {
								// Set Liked Status //
								const liked = await commentLikesCollection.c_existance(
									req.decoded._id,
									returned.comments[i]._id
								)
			
								returned.comments[i].liked = liked.existance
							}
							catch (err) { console.log(`comments: Error --> ${err}`) }
						}
					}
				}
			
				res.status(200).send(returned)
			}
			else { res.status(200).send(postExistance) }
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'comments: Invalid params',
			})
		}
	},
)


// [EXPORT] //
module.exports = router