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
	AdminsCollection.login(),
	async (req, res) => {
		res.json({ status: 'success', token: res.token }).status(201).send()
	}
	
)


// [REGISTER] //
router.post(
	'/register',
	AdminsCollection.register(),
	async (req, res) => { res.json({ status: 'success' }).status(201).send() }
)


// [EXPORT] //
module.exports = router