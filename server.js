/**
 * %%%%%%%%%%%%%%%%%%%% *
 * %%% SERVER INDEX %%% *
 * %%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
require('dotenv').config()


// [REQUIRE] Personal //
const admins = require('./routes/api/admins')
const blocks = require('./routes/api/blocks')
const blockVotes = require('./routes/api/block-votes')
const comments = require('./routes/api/comments')
const commentVotes = require('./routes/api/comment-votes')
const follows = require('./routes/api/follows')
const notifications = require('./routes/api/notifications')
const reports = require('./routes/api/reports')
const users = require('./routes/api/users')


// [REQUIRE] Personal - Adminstration //
const admininstrationBlocks = require('./routes/api/adminstration/blocks')
const admininstrationComments = require('./routes/api/adminstration/comments')
const admininstrationReports = require('./routes/api/adminstration/reports')
const admininstrationUsers = require('./routes/api/adminstration/users')


// [INIT] //
const app = express()


// [USE] //
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


// [USE] Personal //
app.use('/api/admins', admins)
app.use('/api/blocks', blocks)
app.use('/api/block-votes', blockVotes)
app.use('/api/comments', comments)
app.use('/api/comment-votes', commentVotes)
app.use('/api/follows', follows)
app.use('/api/notifications', notifications)
app.use('/api/reports', reports),
app.use('/api/users', users)


// [USE] Personal - Adminstration //
app.use('/api/administration/blocks', admininstrationBlocks)
app.use('/api/administration/comments', admininstrationComments)
app.use('/api/administration/reports', admininstrationReports)
app.use('/api/administration/users', admininstrationUsers)


// [PORT + LISTEN] //
const port = process.env.PORT || 5000
app.listen(port, function() { console.log(`Server Running on Port: ${port}`) })


// [MAIN ROUTE] //
app.get('', async (req, res) => {
	const html = `<h1 style="color: #4d31ce;">BlockBased API</h1>W`

	res.send(html)
})