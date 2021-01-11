// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const postsCollection = require('../../../s-collections/postsCollection')
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
				let user_id = undefined

				// [SET] user_id //
				if (req.decoded) { user_id = req.decoded.user_id }

				// [READ-ALL] Sort //
				const postsObj = await postsCollection.c_readByCatSorted(
					user_id,
					req.params.cat_id,
					sort,
					limit,
					skip,
				)

				if (postsObj.status) {
					// [PINNED] (1st Page Only) //
					if (pageIndex == 0) {
						const { posts: pinnedPosts } = await postsCollection.c_readPinned(
							user_id,
							req.params.cat_id
						)

						// For Each Pinned Post Insert It At the Beginning of Array //
						pinnedPosts.forEach(p => { postsObj.posts.unshift(p) })
					}

					// [COUNT] Posts //
					postsObj.postsCount = (
						await postsCollection.c_countByCat(req.params.cat_id)
					).count
					
					// [COUNT] Calculate Pages //
					postsObj.totalPages = Math.ceil(postsObj.postsCount / limit)
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