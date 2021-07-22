const coinbaseState = require('../s-api/coinbase/state')


module.exports = {
	prices: function () {
		const products = [
			'UNI-USD',
			'LINK-USD',
			'MATIC-USD',
			'YFI-USD',
			'GRT-USD',
			'COMP-USD',
			'OMG-USD',
			'ZRX-USD',
			'AMP-USD',
			'AAVE-USD',
		]

		let returnVal = []

		for (let i = 0; i < products.length; i++) {
			const p = products[i]
			
			const ii = coinbaseState.candle_1m.findIndex(
				(element) => element.product_id == p
			)

			returnVal.push(coinbaseState.candle_1m[ii])
		}

		return {
			executed: true,
			status: true,
			returnVal: returnVal
		}
	},
}