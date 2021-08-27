// [REQUIRE] //
const axios = require('axios')


let coins = []

module.exports = {
	coins: coins,

	updateCoins: async function () {
		try {
			const res = await axios.get(
				`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&sparkline=false`
			)
	
			coins = res.data
		}
		catch (err) { console.log(`coingecko API Error --> ${err}`) }
	},


	getCoins: function () { return coins }
}