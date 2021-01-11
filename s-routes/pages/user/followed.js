// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const commentsCollection = require('../../../s-collections/commentsCollection')
const postsCollection = require('../../../s-collections/postsCollection')
const postLikesCollection = require('../../../s-collections/postLikesCollection')
const postFollowsCollection = require('../../../s-collections/postFollowsCollection')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [READ-ALL] //
router.get(
	'/:sort/:limit/:page',
	Auth.userToken(),
	async (req, res) => {
		try {
			if (
				Number.isInteger(parseInt(req.params.sort)) &&
				Number.isInteger(parseInt(req.params.limit)) &&
				Number.isInteger(parseInt(req.params.page))
			) {
				// [INIT] //
				const sort = parseInt(req.params.sort)
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit
				let posts = []

				// [COUNT] postFollows //
				const totalFollows = (
					await postFollowsCollection.c_countAllUser(req.decoded.user_id)
				).count

				// [CALCULATE] totalPages //
				const totalPages = Math.ceil(totalFollows / limit)
				
				// [READ-ALL] postFollows for user //
				const pFObj = await postFollowsCollection.c_readByUserSorted(
					req.decoded.user_id,
					sort,
					limit,
					skip
				)

				for (let i = 0; i < pFObj.postFollows.length; i++) {
					const postObj = await postsCollection.c_read(
						req.decoded.user_id,
						pFObj.postFollows[i].post
					)
					
					if (postObj.status) { posts.push(postObj.post) }
					else { res.status(200).send(postObj) }
				}

				res.status(200).send({
					executed: true,
					status: true,
					posts: posts,
					totalFollows: totalFollows,
					totalPages: totalPages,
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