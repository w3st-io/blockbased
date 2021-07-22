// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const postsCollection = require('../../s-collections/postsCollection')
const config = require('../../s-config')
const Auth = require('../../s-middleware/Auth')
const categories = require('../../s-defaults/categories')
const cryptoQuote = require('../../s-utils/crypto-quote')
const finnhub = require('../../s-api/finnhub')


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
			
			
			// [CRYPTO-QUOTE] //
			const cryptoQuoteObj = cryptoQuote.prices()


			// [FINNHUB] //
			const news = finnhub.getNews()


			// [CATEGORIES] //
			for (let i = 0; i < categories.length; i++) {
				const category = categories[i]

				for (let ii = 0; ii < category.cats.length; ii++) {
					const cat = category.cats[ii]
					
					// [FILL][TOTAL-POSTS] //
					const { count: postCount } = await postsCollection.c_countByCat(
						cat.cat_id
					)

					cat.totalPosts = postCount

					// [FILL][RECENT-POST] //
					const pObj = await postsCollection.c_readByCatSorted(
						user_id,
						cat.cat_id,
						0,
						1,
						0
					)

					cat.recentPost = pObj.posts[0]
				}
			}
			
			// [TOP-POSTS] //
			const topPObj = await postsCollection.c_readSorted(user_id, 1, 5, 0)

			const topPosts = topPObj.posts
			
			res.send({
				executed: true,
				status: true,
				customHome: customHome,
				cryptoQuoteObj: cryptoQuoteObj,
				categories: categories,
				topPosts: topPosts,
				news: news,
			})
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/user',
				message: `Caught Error --> ${err}`
			})
		}
	}
)


module.exports = router