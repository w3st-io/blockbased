let prices = {
	eth: 0
}

if (process.env.NODE_ENV == 'production') {
	// Update Crypto Prices Every 10 seconds //
	setInterval( () => {
		console.log('Crypto Price Updated')
	}, 10000)
}
else {
	// Update Crypto Prices Every 2 seconds //
	setInterval( () => {
		console.log('Dev Crypto Price Updated')
		prices.eth++
	}, 2000)
}

module.exports = {
	prices
}