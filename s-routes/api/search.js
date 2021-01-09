// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const config = require('../../s-config')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [SEARCH] //
router.get(
	'/:query',
	async (req, res) => { res.send() }
)


// [EXPORT] //
module.exports = router