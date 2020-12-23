/**
 * %%%%%%%%%%%%%%%%%%%
 * %%% INDEX ROUTE %%%
 * %%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')

// [REQUIRE] Personal //
const config = require('../../s-config')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [MAIN-ROUTE] //
router.get(
	'/',
	async (req, res) => {
		res.send({
			working: true,
		})
	}
)

// [BASE-URL] //
router.get(
	'/get-base-url',
	async (req, res) => { res.send(config.BASE_URL) }
)
	
// [SOCKET-BASE-URL] //
router.get(
	'/get-socket-base-url',
	async (req, res) => { res.send(config.SOCKET_BASE_URL) }
)


// [EXPORT] //
module.exports = router