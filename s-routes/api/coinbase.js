// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const coinbaseState = require('../../s-api/coinbase/state')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/',
	async (req, res) => {
		try {
			res.send({
				executed: true,
				status: true,
				candles: {
					candle_1m_count: coinbaseState.candle_1m.length,
					candle_5m_count: coinbaseState.candle_5m.length,
					candle_15m_count: coinbaseState.candle_15m.length,
					candle_1h_count: coinbaseState.candle_1h.length,
					candle_6h_count: coinbaseState.candle_6h.length,
					candle_1d_count: coinbaseState.candle_1d.length,

					candle_1m: coinbaseState.candle_1m,
					candle_5m: coinbaseState.candle_5m,
					candle_15m: coinbaseState.candle_15m,
					candle_1h: coinbaseState.candle_1h,
					candle_6h: coinbaseState.candle_6h,
					candle_1d: coinbaseState.candle_1d,
				},
			})
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/coinbase',
				message: `Caught Error --> ${err}`,
			})
		}
	}
)


module.exports = router