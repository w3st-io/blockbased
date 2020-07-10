/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% ADMIN ROUTE %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
require('dotenv').config()

// [REQUIRE] Personal //
const AdminsCollection = require('../../server-collections/AdminsCollection')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [ACCOUNT] *******************/
// [LOGIN] //
router.post(
	'/login',
	AdminsCollection.login(),
)


// [REGISTER] //
router.post(
	'/register',
	AdminsCollection.register(),
)


// [EXPORT] //
module.exports = router