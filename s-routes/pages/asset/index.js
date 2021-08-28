// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const coingecko = require('../../../s-api/coingecko')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/index/:exchange/:product_id/:timeframe/:candlecount',
	async (req, res) => {
		try {
			if (validator.isAscii(req.params.product_id)) {
				// [INIT] //
				let cryptocurrency_id = ''
				let coingeckCryptocurrencyData = {}

				// Create cryptocurrency_id //
				for (var i = 0; i < req.params.product_id.length; i++) {
					if (req.params.product_id.charAt(i) != '-') {
						cryptocurrency_id = cryptocurrency_id.concat(
							req.params.product_id.charAt(i)
						)
					}
					else { break }
				}

				// [FORMAT] //
				cryptocurrency_id = cryptocurrency_id.toLowerCase()

				// Get cryptocurrency details // 
				for (let i = 0; i < coingecko.getCoins().length; i++) {
					const cryptocurrency = coingecko.getCoins()[i];
					
					if (cryptocurrency.symbol == cryptocurrency_id) {
						coingeckCryptocurrencyData = cryptocurrency
						break
					}
				}
			
				res.send({
					executed: true,
					status: true,
					cryptocurrencyData: coingeckCryptocurrencyData,
				})
			}
			else {
				res.send({
					executed: true,
					status: false,
					message: 'Invalid product_id',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/asset',
				message: `Caught Error --> ${err}`
			})
		}
	}
)


module.exports = router