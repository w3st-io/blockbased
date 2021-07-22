// [REQUIRE] //
const CoinbasePro = require('coinbase-pro')


// [REQUIRE] Personal //
const coinbaseApi = require('./api')
const config = require('../../s-config')
const state = require('./state')
const timeUtil = require('../../s-utils/timeUtil')

module.exports = {
	start: async (io) => {
		// [INIT] //
		let allProduct_id = []

		// [COINBASE-API] Get all products //
		const products = await coinbaseApi.s_getProducts()

		// [FOR-EACH] products //
		for (let i = 0; i < products.products.length; i++) {
			const p = products.products[i];
			
			allProduct_id.push(p.id)
	
			state.initialize({ product_id: p.id })
		}

		state.markInitialzed()

		// [SOCKET] //
		const websocket = new CoinbasePro.WebsocketClient(
			allProduct_id,
			'wss://ws-feed.pro.coinbase.com',
			{
				key: config.COINBASE_API_KEY,
				secret: config.COINBASE_API_SECRET,
				passphrase: config.COINBASE_API_PASS_PHRASE,
			},
			{ channels: ['ticker'] }
		)


		// [WSS] message //
		websocket.on('message', async (data) => {
			try {
				if (data.type == 'ticker') {
					const updatedCandle = await state.updateCandles({
						product_id: data.product_id,
						price: data.price,
						open_24h: data.open_24h,
						low_24h: data.low_24h,
						high_24h: data.high_24h,
						volume_24h: data.volume_24h,
						volume_30d: data.volume_30d,
					})
					
					if (updatedCandle) {
						io.to(`coinbase-${data.product_id}`).emit(
							'update-candle',
							{
								product_id: data.product_id,
								updatedCandle: updatedCandle
							}
						)
					}
				}
			}
			catch(e) { console.log(`Caught Error --> ${e}`) }
		})


		// [WSS] error //
		websocket.on('error', (err) => { console.log('Error:', err) })


		// [WSS] close //
		websocket.on('close', () => { console.log('COINBASE WS CLOSED') })


		// [TIME-OUT][1M] Start on the next minute //
		setTimeout(async () => {
			// [STATE] Create new Candle for the first time (Will not repeat again) //
			await state.createNewCandle({ timeFrame: '1m' })

			io.to(`coinbase-1m`).emit('coinbase-1m')

			// [INTERVAL] Create new Candle every 60s //
			setInterval(async () => {
				await state.createNewCandle({ timeFrame: '1m' })

				io.to(`coinbase-1m`).emit('coinbase-1m')

			}, 60 * 1000)
		}, timeUtil.secondsTillNext1MinInterval() * 1000)


		// [TIME-OUT][5M] Start on the next minute //
		setTimeout(async () => {
			// Create new Candle for the first time (Will not repeat again) //
			await state.createNewCandle({ timeFrame: '5m' })

			io.to(`coinbase-5m`).emit('coinbase-5m')

			// [INTERVAL] Create new Candle every 300s //
			setInterval(async () => {
				await state.createNewCandle({ timeFrame: '5m' })

				io.to(`coinbase-5m`).emit('coinbase-5m')

			}, 300 * 1000)
		}, timeUtil.secondsTillNext5MinInterval() * 1000)


		// [TIME-OUT][15M] Start on the next minute //
		setTimeout(async () => {
			// [STATE] Create new Candle for the first time (Will not repeat again) //
			await state.createNewCandle({ timeFrame: '15m' })

			io.to(`coinbase-15m`).emit('coinbase-15m')

			// [INTERVAL] Create new Candle every 900s //
			setInterval(async () => {
				await state.createNewCandle({ timeFrame: '15m' })

				io.to(`coinbase-15m`).emit('coinbase-15m')

			}, 900 * 1000)
		}, timeUtil.secondsTillNext15MinInterval() * 1000)


		// [TIME-OUT][1H] Start on the next minute //
		setTimeout(async () => {
			// [STATE] Create new Candle for the first time (Will not repeat again) //
			await state.createNewCandle({ timeFrame: '1h' })

			io.to(`coinbase-1h`).emit('coinbase-1h')

			// [INTERVAL] Create new Candle every 60s //
			setInterval(async () => {
				await state.createNewCandle({ timeFrame: '1h' })

				io.to(`coinbase-1h`).emit('coinbase-1h')

			}, 3600 * 1000)
		}, timeUtil.secondsTillNext1HourInterval() * 1000)


		// [TIME-OUT][6H] Start on the next minute //
		setTimeout(async () => {
			// [STATE] Create new Candle for the first time (Will not repeat again) //
			await state.createNewCandle({ timeFrame: '6h' })

			io.to(`coinbase-6h`).emit('coinbase-6h')

			// [INTERVAL] Create new Candle every 21600s //
			setInterval(async () => {
				await state.createNewCandle({ timeFrame: '6h' })

				io.to(`coinbase-6h`).emit('coinbase-6h')

			}, 21600 * 1000)
		}, timeUtil.secondsTillNext6HourInterval() * 1000)


		// [TIME-OUT][1D] Start on the next minute //
		setTimeout(async () => {
			// [STATE] Create new Candle for the first time (Will not repeat again) //
			await state.createNewCandle({ timeFrame: '1d' })

			io.to(`coinbase-1d`).emit('coinbase-1d')

			// [INTERVAL] Create new Candle every 60s //
			setInterval(async () => {
				await state.createNewCandle({ timeFrame: '1d' })

				io.to(`coinbase-1d`).emit('coinbase-1d')

			}, 86400 * 1000)
		}, timeUtil.secondsTillNext1DayInterval() * 1000)
	}
}