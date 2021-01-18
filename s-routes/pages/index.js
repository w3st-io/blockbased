// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const postsCollection = require('../../s-collections/postsCollection')
const Auth = require('../../s-middleware/Auth')
const cats = require('../../s-defaults/cats')
const cryptoQuote = require('../../s-utils/crypto-quote')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		try {
			// [INIT] //
			const user_id = (req.decoded) ? req.decoded.user_id : undefined

			for (let i = 0; i < cats.length; i++) {
				// [TOTAL-POSTS] //
				cats[i].totalPosts = (
					await postsCollection.c_countByCat(cats[i].cat_id)
				).count

				// [RECENT-POST] //
				cats[i].recentPost = (
					await postsCollection.c_readByCatSorted(
						user_id,
						cats[i].cat_id,
						0,
						1,
						0
					)
				).posts[0]

			}
			
			// [TOP-POSTS] //
			const topPosts = (
				await postsCollection.c_readSorted(user_id, 1, 5, 0)
			).posts

			
			res.send({
				executed: true,
				status: true,
				cats: cats,
				topPosts: topPosts,
				cryptoQuote: cryptoQuote.prices,
				directory: __dirname,
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