// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const postsCollection = require('../../../s-collections/postsCollection')
const categories = require('../../../s-defaults/categories')
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
				const user_id = (req.user_decoded) ? req.user_decoded.user_id : undefined
				const sort = parseInt(req.params.sort)
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit

				// [READ-ALL] Sort //
				const pObj = await postsCollection.c_readByCatSorted(
					user_id,
					req.params.cat_id,
					sort,
					limit,
					skip,
				)

				if (pObj.status) {
					// [PINNED] (1st Page Only) //
					if (pageIndex == 0) {
						const { posts: pinnedPosts } = await postsCollection.c_readPinned(
							user_id,
							req.params.cat_id
						)

						// For Each Pinned Post Insert It At the Beginning of Array //
						pinnedPosts.forEach(p => { pObj.posts.unshift(p) })
					}

					// [COUNT] Posts //
					pObj.postsCount = (
						await postsCollection.c_countByCat(req.params.cat_id)
					).count
					
					// [COUNT] Calculate Pages //
					pObj.totalPages = Math.ceil(pObj.postsCount / limit)
					
					res.send({
						executed: true,
						status: true,
						categories: categories,
						postsObj: pObj,
					})
				}
				else { res.send(pObj) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/pages/cat',
					message: 'Invalid Params',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/cat',
				message: `Caught Error --> ${err}`,
			})
		}
	}
)


module.exports = router