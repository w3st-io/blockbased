/**
 * %%%%%%%%%%%%%%%%%%%% *
 * %%% SERVER INDEX %%% *
 * %%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal + ENV //
const admins = require('./routes/api/admins')
const admininstrationBlocks = require('./routes/api/adminstration/blocks')
const admininstrationComments = require('./routes/api/adminstration/comments')
const admininstrationReports = require('./routes/api/adminstration/reports')
const admininstrationUsers = require('./routes/api/adminstration/users')
const blocks = require('./routes/api/blocks')
const blockVotes = require('./routes/api/block-votes')
const cats = require('./routes/api/cats')
const comments = require('./routes/api/comments')
const commentVotes = require('./routes/api/comment-votes')
const forums = require('./routes/api/forums')
const reports = require('./routes/api/reports')
const users = require('./routes/api/users')
require('dotenv').config()


// [INIT] //
const app = express()


// [USE] //
app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))


// [INIT USE] //
app.use('/api/admins', admins)
app.use('/api/blocks', blocks)
app.use('/api/block-votes', blockVotes)
app.use('/api/cats', cats)
app.use('/api/comments', comments)
app.use('/api/comment-votes', commentVotes)
app.use('/api/forums', forums)
app.use('/api/reports', reports),
app.use('/api/users', users)


// [INIT USE] Adminstration //
app.use('/api/administration/blocks', admininstrationBlocks)
app.use('/api/administration/comments', admininstrationComments)
app.use('/api/administration/reports', admininstrationReports)
app.use('/api/administration/users', admininstrationUsers)

// [ROUTE] //
app.get('', async (req, res) => {
	const html = `
	<h1 style="color: #4d31ce;">
		BlockBased API
	</h1>
`

	res.send(html)
})


/*** [PORT + LISTEN] ***/
const port = process.env.PORT || 5000

app.listen(port, function () {
	console.log(`Server Running on Port: ${port}`)
})