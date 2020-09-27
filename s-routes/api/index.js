/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% INDEX ROUTE %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

// [INIT] //
const port = process.env.PORT || 5000
const base_url = process.env.BASE_URL || `http://localhost:${port}`


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [MAIN-ROUTE] //
router.get(
	'/',
	async (req, res) => {
		res.send('API')
	}
)

	
// [BASE-URL-ROUTE] For the socket //
router.get(
	'/get-base-url',
	async (req, res) => {
		res.send(base_url)
	}
)


// [EXPORT] //
module.exports = router