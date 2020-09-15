/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% ADMIN ROUTE %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const rateLimiters = require('../../../rate-limiters')
const adminsCollection = require('../../../server-collections/adminsCollection')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [EXPORT] //
module.exports = router