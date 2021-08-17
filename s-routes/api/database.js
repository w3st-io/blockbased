// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const config = require('../../s-config')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [MAIN-ROUTE] //
router.get(
	'/initialize',
	async (req, res) => {
		try {
			res.send({
				executed: true,
				status: true,
				location: '/api/database',
				message: 'initialized',
			})
		}
		catch (err) {
			res.send({
				executed: true,
				status: true,
				location: '/api/database',
				message: `Caught Err --> ${err}`,
			})
		}
	}
)


module.exports = router