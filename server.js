/**
 * %%%%%%%%%%%%%%%%%%%% *
 * %%% SERVER INDEX %%% *
 * %%%%%%%%%%%%%%%%%%%% *
 * 
*/
// [REQUIRE] //
const bodyParser = require("body-parser")
const cors = require("cors")
const express = require("express")


// [REQUIRE] Personal + ENV //
const admins = require('./routes/api/admins')
const blocks = require('./routes/api/blocks')
const blockVotes = require('./routes/api/block-votes')
const cats = require('./routes/api/cats')
const comments = require('./routes/api/comments')
const forums = require('./routes/api/forums')
const users = require('./routes/api/users')
const { use } = require("./routes/api/admins")
require('dotenv').config()


// [INIT] //
const app = express()


// [USE] //
app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))


// [PAGE] Front Page //
app.get('', async (req, res) => {
	res.send(`
		<h1 style="color: #434875;">
			BlockBased API
		</h1>
	`)
})


// [INIT USE] For "this" route use "this" //
app.use('/api/admins', admins)
app.use('/api/blocks', blocks)
app.use('/api/block-votes', blockVotes)
app.use('/api/cats', cats)
app.use('/api/comments', comments)
app.use('/api/forums', forums)
app.use('/api/users', users)


/*** [PORT + LISTEN] ***/
const port = process.env.PORT || 5000

app.listen(port, function () {
	console.log(`Server Running on Port: ${port}`)
})