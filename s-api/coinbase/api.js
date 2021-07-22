// [REQUIRE] //
const CoinbasePro = require('coinbase-pro')


// [COINBASE] //
const publicClient = new CoinbasePro.PublicClient()


module.exports = {
	s_getProducts: async () => {
		try {
			const products = await publicClient.getProducts()

			return {
				executed: true,
				status: true,
				products: products,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: '/s-crypto/coinbase/api',
				message: `Caught Error --> ${err}`,
			}
		}
	},


	getProductHistoricRates: async ({ product_id, granularity }) => {
		try {
			const history = await publicClient.getProductHistoricRates(
				product_id,
				{ granularity: granularity },
			)

			return {
				executed: true,
				status: true,
				history: history
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: '/s-crypto/coinbase/api',
				message: `Caught Error --> ${err}`,
			}
		}
	},
	

	getProduct24HrStats: async ({ product_id }) => {
		try {
			const stats = await publicClient.getProduct24HrStats(product_id)
	
			return {
				executed: true,
				status: true,
				stats: stats
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: '/s-crypto/coinbase/api',
				message: `Caught Error --> ${err}`,
			}
		}
	},
}