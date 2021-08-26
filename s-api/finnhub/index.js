// [REQUIRE] //
const axios = require('axios')


// [REQUIRE] //
const config = require('../../s-config')


let news = []

module.exports = {
	news: news,

	updateNews: async function () {
		try {
			const res = await axios.get(
				`https://finnhub.io/api/v1/news?category=crypto&token=${config.FINNHUB_KEY}`
			)
	
			news = res.data
		}
		catch (err) { console.log(`Finnhub API Error --> ${err}`) }
	},


	getNews: function () { return news }
}