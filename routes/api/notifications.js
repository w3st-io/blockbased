/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% NOTIFICATIONS ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const jwt = require('jsonwebtoken')
const mongodb = require('mongodb')
require('dotenv').config()


// [REQUIRE] Personal //
const Collections = require('../../server-collections')


// [REQUIRE] Personal //
const Auth = require('../../server-middleware/AuthMiddleware')


// [INIT] //
const router = express.Router().use(cors())


// [EXPORT] //
module.exports = router