const axios = require('axios')


const config = require('../s-config')


let prices = {
	executed: null,
	status: null,
	btcusdt: {
		last: 0.00,
		change: 0.00,
		previousLast: 0.00
	},
	ethusdt: {
		last: 0.00,
		change: 0.00,
		previousLast: 0.00
	},
	message: '',
}


if (process.env.NODE_ENV == 'production') {
	// Update Every 2 minutes //
	setInterval( async () => {
		try {
			const baseURL = 'https://cloud.iexapis.com/stable/'
			const symbols='btcusdt,ethusdt'
			const types = 'quote'
			const token = config.IEX_PUBLIC_KEY
			const reqURL = `${baseURL}stock/market/batch?symbols=${symbols}&types=${types}&token=${token}`

			// If no token
			if (token == '') {
				prices.status = false,
				prices.message = 'No iex token passed'
		
				return
			}

			const { data } = await axios.get(reqURL)

			if (data) {
				prices.status = true

				// Set Old //
				prices.btcusdt.previousLast = prices.btcusdt.last 
				prices.ethusdt.previousLast = prices.ethusdt.last

				// Set New //
				prices.btcusdt.last = data.BTCUSDT.quote.latestPrice
				prices.ethusdt.last = data.ETHUSDT.quote.latestPrice
			}
			else { prices.status = false }
		}
		catch (err) {
			prices.status = false
			prices.message = `Error --> ${err}`
		}
	}, 120000)
}
else {
	// Update Every 2 seconds //
	setInterval( async () => {
		try {
			const baseURL = 'https://sandbox.iexapis.com/stable/'
			const symbols='btcusdt,ethusdt'
			const types = 'quote'
			const token = config.IEX_SB_PUBLIC_KEY
			const reqURL = `${baseURL}stock/market/batch?symbols=${symbols}&types=${types}&token=${token}`

			// If no sb token
			if (token == '') {
				prices.status = false,
				prices.message = 'No sandbox iex token passed'
		
				return
			}

			const { data } = await axios.get(reqURL)

			if (data) {
				prices.status = true

				// Set Old //
				prices.btcusdt.previousLast = prices.btcusdt.last 
				prices.ethusdt.previousLast = prices.ethusdt.last

				// Set New //
				prices.btcusdt.last = data.BTCUSDT.quote.latestPrice
				prices.ethusdt.last = data.ETHUSDT.quote.latestPrice
			}
			else { prices.status = false }
		}
		catch (err) {
			prices.status = false
			prices.message = `Error --> ${err}`
		}
	}, 2000)
}

module.exports = {
	prices
}