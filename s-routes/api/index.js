// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const config = require('../../s-config')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/',
	async (req, res) => {
		res.send({
			executed: true,
			status: true,
			node_env: config.NODE_ENV,
			iexKey: config.IEX_PUBLIC_KEY,
			iexSBKey: config.IEX_SB_PUBLIC_KEY,
		})
	}
)


module.exports = router