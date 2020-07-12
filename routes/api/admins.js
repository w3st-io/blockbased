/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% ADMIN ROUTE %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const AdminsCollection = require('../../server-collections/AdminsCollection')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [LOGIN/REGISTER] *******************/
// [LOGIN] //
router.post(
	'/login',
	async (req, res) => {
		const returnedData = await AdminsCollection.login(req)

		res.status(200).send(returnedData)
	}
)

// [REGISTER] //
router.post(
	'/register',
	async (req, res) => {
		const returnedData = await AdminsCollection.register(req)

		res.status(201).send(returnedData)
	}
)


// [EXPORT] //
module.exports = router