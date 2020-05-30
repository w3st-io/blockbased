
/**
 * %%%%%%%%%%%%%%%%%%%% *
 * %%% SERVER INDEX %%% *
 * %%%%%%%%%%%%%%%%%%%% *
 * 
*/
/*** [REQUIRE] ***/
const bodyParser = require("body-parser")
const cors = require("cors")
const express = require("express")

/*** [REQUIRE] Personal + ENV ***/
const admins = require('./routes/api/admins')
const users = require('./routes/api/users')
require('dotenv').config()

/*** [INIT] ***/
const app = express()

/*** [USE] ***/
app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))

/*** [INIT USE] For "this" route use "this" ***/
app.use('/api/admins', admins)
app.use('/api/users', users)

/*** [PORT + LISTEN] ***/
const port = process.env.PORT || 5000

app.listen(port, function () {
	console.log(`Server Running on Port: ${port}`)
})