/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% INDEX ROUTE %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')

// [REQUIRE] Personal //
const config = require('../../s-config')

// [INIT] //
const baseUrl = config.BASE_URL
const socketBaseUrl = config.SOCKET_BASE_URL


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [MAIN-ROUTE] //
router.get(
	'/',
	async (req, res) => { res.send('API') }
)

// [BASE-URL] //
router.get(
	'/get-base-url',
	async (req, res) => { res.send(baseUrl) }
)
	
// [SOCKET-BASE-URL] //
router.get(
	'/get-socket-base-url',
	async (req, res) => { res.send(socketBaseUrl) }
)


// [EXPORT] //
module.exports = router