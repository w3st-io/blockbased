// [INIT] //
let initialized = false
let candle_1m = []
let candle_5m = []
let candle_15m = []
let candle_1h = []
let candle_6h = []
let candle_1d = []


module.exports = {
	initialized: initialized,


	candle_1m: candle_1m,

	
	candle_5m: candle_5m,


	candle_15m: candle_15m,


	candle_1h: candle_1h,


	candle_6h: candle_6h,


	candle_1d: candle_1d,


	initialize: async function ({ product_id }) {
		try {
			let open = 0.00
			let high = 0.00
			let low = 0.00
			let close = 0.00
			let open_24h = 0.00
			let low_24h = 0.00
			let high_24h = 0.00
			let volume_24h = 0.00
			let volume_30d = 0.00
			
			// [CANDLE] 1m //
			candle_1m.push({
				product_id: product_id,
				open: open,
				high: high,
				low: low,
				close: close,
				open_24h: open_24h,
				low_24h: low_24h,
				high_24h: high_24h,
				volume_24h: volume_24h,
				volume_30d: volume_30d,
			})

			// [CANDLE] 5m //
			candle_5m.push({
				product_id: product_id,
				open: open,
				high: high,
				low: low,
				close: close,
				open_24h: open_24h,
				low_24h: low_24h,
				high_24h: high_24h,
				volume_24h: volume_24h,
				volume_30d: volume_30d,
			})

			// [CANDLE] 15m //
			candle_15m.push({
				product_id: product_id,
				open: open,
				high: high,
				low: low,
				close: close,
				open_24h: open_24h,
				low_24h: low_24h,
				high_24h: high_24h,
				volume_24h: volume_24h,
				volume_30d: volume_30d,
			})

			// [CANDLE] 1h //
			candle_1h.push({
				product_id: product_id,
				open: open,
				high: high,
				low: low,
				close: close,
				open_24h: open_24h,
				low_24h: low_24h,
				high_24h: high_24h,
				volume_24h: volume_24h,
				volume_30d: volume_30d,
			})

			// [CANDLE] 6h //
			candle_6h.push({
				product_id: product_id,
				open: open,
				high: high,
				low: low,
				close: close,
				open_24h: open_24h,
				low_24h: low_24h,
				high_24h: high_24h,
				volume_24h: volume_24h,
				volume_30d: volume_30d,
			})

			// [CANDLE] 1d //
			candle_1d.push({
				product_id: product_id,
				open: open,
				high: high,
				low: low,
				close: close,
				open_24h: open_24h,
				low_24h: low_24h,
				high_24h: high_24h,
				volume_24h: volume_24h,
				volume_30d: volume_30d,
			})

			return {
				executed: true,
				status: true,
			}
		}
		catch (err) {
			console.log('Caught Error', err)
			return {
				executed: false,
				status: false,
				location: '/s-crypto/coinbase/state',
				message: `Caught Error --> ${err}`,
			}
		}
	},


	markInitialzed: function () { initialized = true },


	updateCandles: async function ({ product_id, price, open_24h, low_24h, high_24h, volume_24h, volume_30d }) {
		if (initialized) {
			const i = candle_1m.findIndex((element) => element.product_id == product_id)

			// Set price of asset after initialization
			if (candle_1m[i].open == 0) candle_1m[i].open = parseFloat(price)
			if (candle_5m[i].open == 0) candle_5m[i].open = parseFloat(price)
			if (candle_15m[i].open == 0) candle_15m[i].open = parseFloat(price)
			if (candle_1h[i].open == 0) candle_1h[i].open = parseFloat(price)
			if (candle_6h[i].open == 0) candle_6h[i].open = parseFloat(price)
			if (candle_1d[i].open == 0) candle_1d[i].open = parseFloat(price)

			if (candle_1m[i].low == 0) candle_1m[i].low = parseFloat(price)
			if (candle_5m[i].low == 0) candle_5m[i].low = parseFloat(price)
			if (candle_15m[i].low == 0) candle_15m[i].low = parseFloat(price)
			if (candle_1h[i].low == 0) candle_1h[i].low = parseFloat(price)
			if (candle_6h[i].low == 0) candle_6h[i].low = parseFloat(price)
			if (candle_1d[i].low == 0) candle_1d[i].low = parseFloat(price)

			// [1m] New values //
			candle_1m[i].close = parseFloat(price)

			if (parseFloat(price) > candle_1m[i].high) {
				candle_1m[i].high = parseFloat(price)
			}
			if (parseFloat(price) < candle_1m[i].low) {
				candle_1m[i].low = parseFloat(price)
			}

			// [5m] New values //
			candle_5m[i].close = parseFloat(price)

			if (parseFloat(price) > candle_5m[i].high) {
				candle_5m[i].high = parseFloat(price)
			}
			if (parseFloat(price) < candle_5m[i].low) {
				candle_5m[i].low = parseFloat(price)
			}

			// [15m] New values //
			candle_15m[i].close = parseFloat(price)

			if (parseFloat(price) > candle_15m[i].high) {
				candle_15m[i].high = parseFloat(price)
			}
			if (parseFloat(price) < candle_15m[i].low) {
				candle_15m[i].low = parseFloat(price)
			}

			// [1h] New values //
			candle_1h[i].close = parseFloat(price)

			if (parseFloat(price) > candle_1h[i].high) {
				candle_1h[i].high = parseFloat(price)
			}
			if (parseFloat(price) < candle_1h[i].low) {
				candle_1h[i].low = parseFloat(price)
			}

			// [6h] New values //
			candle_6h[i].close = parseFloat(price)

			if (candle_6h[i].close > candle_6h[i].high) {
				candle_6h[i].high = parseFloat(price)
			}
			if (candle_6h[i].close < candle_6h[i].low) {
				candle_6h[i].low = parseFloat(price)
			}

			// [1d] New values //
			candle_1d[i].close = parseFloat(price)
			if (parseFloat(price) > candle_1d[i].high) {
				candle_1d[i].high = parseFloat(price)
			}
			if (parseFloat(price) < candle_1d[i].low) {
				candle_1d[i].low = parseFloat(price)
			}

			// open_24h //
			candle_1m[i].open_24h = parseFloat(open_24h)
			candle_5m[i].open_24h = parseFloat(open_24h)
			candle_15m[i].open_24h = parseFloat(open_24h)
			candle_1h[i].open_24h = parseFloat(open_24h)
			candle_6h[i].open_24h = parseFloat(open_24h)
			candle_1d[i].open_24h = parseFloat(open_24h)

			// low_24h //
			candle_1m[i].low_24h = parseFloat(low_24h)
			candle_5m[i].low_24h = parseFloat(low_24h)
			candle_15m[i].low_24h = parseFloat(low_24h)
			candle_1h[i].low_24h = parseFloat(low_24h)
			candle_6h[i].low_24h = parseFloat(low_24h)
			candle_1d[i].low_24h = parseFloat(low_24h)

			// high_24h //
			candle_1m[i].high_24h = parseFloat(high_24h)
			candle_5m[i].high_24h = parseFloat(high_24h)
			candle_15m[i].high_24h = parseFloat(high_24h)
			candle_1h[i].high_24h = parseFloat(high_24h)
			candle_6h[i].high_24h = parseFloat(high_24h)
			candle_1d[i].high_24h = parseFloat(high_24h)

			// volume_24h //
			candle_1m[i].volume_24h = parseFloat(volume_24h)
			candle_5m[i].volume_24h = parseFloat(volume_24h)
			candle_15m[i].volume_24h = parseFloat(volume_24h)
			candle_1h[i].volume_24h = parseFloat(volume_24h)
			candle_6h[i].volume_24h = parseFloat(volume_24h)
			candle_1d[i].volume_24h = parseFloat(volume_24h)

			// volume_30d //
			candle_1m[i].volume_30d = parseFloat(volume_30d)
			candle_5m[i].volume_30d = parseFloat(volume_30d)
			candle_15m[i].volume_30d = parseFloat(volume_30d)
			candle_1h[i].volume_30d = parseFloat(volume_30d)
			candle_6h[i].volume_30d = parseFloat(volume_30d)
			candle_1d[i].volume_30d = parseFloat(volume_30d)

			return {
				candle_1m: candle_1m[i],
				candle_5m: candle_5m[i],
				candle_15m: candle_15m[i],
				candle_1h: candle_1h[i],
				candle_6h: candle_6h[i],
				candle_1d: candle_1d[i],
			}
		}
	},


	createNewCandle: async function ({ timeFrame }) {
		if (initialized) {
			switch (timeFrame) {
				case '1m':
					for (let i = 0; i < candle_1m.length; i++) {
						let c = candle_1m[i]
						
						c.open = c.close
						c.high = c.close
						c.low = c.close
					}
				break

				case '5m':
					for (let i = 0; i < candle_5m.length; i++) {
						let c = candle_5m[i]

						c.open = c.close
						c.high = c.close
						c.low = c.close
					}
				break

				case '15m':
					for (let i = 0; i < candle_15m.length; i++) {
						let c = candle_15m[i]

						c.open = c.close
						c.high = c.close
						c.low = c.close
					}
				break

				case '1h':
					for (let i = 0; i < candle_1h.length; i++) {
						let c = candle_1h[i]

						c.open = c.close
						c.high = c.close
						c.low = c.close
					}
				break

				case '6h':
					for (let i = 0; i < candle_6h.length; i++) {
						let c = candle_6h[i]

						c.open = c.close
						c.high = c.close
						c.low = c.close
					}
				break

				case '1d':
					for (let i = 0; i < candle_1d.length; i++) {
						let c = candle_1d[i]
						
						c.open = c.close
						c.high = c.close
						c.low = c.close
					}
				break
			}
		}
	},
}