// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const postsCollection = require('../../s-collections/postsCollection')
const config = require('../../s-config')
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
			let customHome = false
			const user_id = (req.user_decoded) ? req.user_decoded.user_id : undefined

			// Set Custom Home Status //
			if (config.CUSTOM_HOME == 'true') { customHome = true }

			for (let i = 0; i < cats.length; i++) {
				// [FILL][TOTAL-POSTS] //
				cats[i].totalPosts = (
					await postsCollection.c_countByCat(cats[i].cat_id)
				).count

				// [FILL][RECENT-POST] //
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

			
			res.status(200).send({
				executed: true,
				status: true,
				customHome: customHome,
				cats: cats,
				topPosts: topPosts,
				cryptoQuote: cryptoQuote.prices,
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


module.exports = router