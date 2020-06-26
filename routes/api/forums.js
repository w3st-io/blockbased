/**
 * %%%%%%%%%%%%%%%%%%%% *
 * %%% FORUM ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongodb = require('mongodb')
require('dotenv').config()


// [REQUIRE] Personal //
const Collections = require('../../server-collections')


// [INIT] //
const router = express.Router().use(cors())


// [EXPORT] //
module.exports = router