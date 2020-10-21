/**
 * %%%%%%%%%%%%%%
 * %%% SERVER %%%
 * %%%%%%%%%%%%%%
*/
// [REQUIRE] //
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const http = require('http')
const mongoose = require('mongoose')
const path = require('path')
const socketIO = require('socket.io')
require('dotenv').config()


// [REQUIRE] Personal - Routes: API / Routes: Pages / Other //
const a_ = require('./s-routes/api')
const a_admininstrationPosts = require('./s-routes/api/administration/posts')
const a_admininstrationComments = require('./s-routes/api/administration/comments')
const a_admininstrationReports = require('./s-routes/api/administration/reports')
const a_admininstrationUsers = require('./s-routes/api/administration/users')
const a_admins = require('./s-routes/api/admins')
const a_posts = require('./s-routes/api/posts')
const a_comments = require('./s-routes/api/comments')
const a_notifications = require('./s-routes/api/notifications')
const a_users = require('./s-routes/api/users')

const p_ = require ('./s-routes/pages')
const p_admin = require('./s-routes/pages/admin')
const p_cat = require('./s-routes/pages/cat')
const p_post = require('./s-routes/pages/post')
const p_post_commentEdit = require('./s-routes/pages/post/comment-edit')
const p_post_commentReply = require('./s-routes/pages/post/comment-reply')
const p_postFollowed = require('./s-routes/pages/user/followed')
const p_postNotifications = require('./s-routes/pages/user/notifications')
const p_profile = require('./s-routes/pages/user/profile')
const p_profile_view = require('./s-routes/pages/user/profile/view')

const s_socket = require('./s-socket')
const config = require('./s-config')
const rateLimiter = require('./s-rate-limiters')


// [EXPRESS + SERVER] //
const app = express()
const server = http.createServer(app)


// [SOCKET.IO] //
const io = socketIO.listen(server)
s_socket.start(io)
app.io = io


// [MONGOOSE-CONNECTION] //
mongoose.connect(
	config.MONG_URI,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	(err, connected) => {
		if (connected) { console.log('Mongoose Connected to DB') }
		else { console.log(`Mongoose Connection Error --> ${err}`) }
	}
)
mongoose.set('useFindAndModify', false)


// [USE] //
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())


// [USE] Personal - Rate-Limiter / API / Pages //
app.use(rateLimiter.limiter)

app.use('/api', a_)
app.use('/api/administration/posts', a_admininstrationPosts)
app.use('/api/administration/comments', a_admininstrationComments)
app.use('/api/administration/reports', a_admininstrationReports)
app.use('/api/administration/users', a_admininstrationUsers)
app.use('/api/admins', a_admins)
app.use('/api/posts', a_posts)
app.use('/api/comments', a_comments)
app.use('/api/notifications', a_notifications)
app.use('/api/users', a_users)

app.use('/pages', p_)
app.use('/pages/admin', p_admin)
app.use('/pages/cat', p_cat)
app.use('/pages/post', p_post)
app.use('/pages/post/comment-edit', p_post_commentEdit)
app.use('/pages/post/comment-reply', p_post_commentReply)
app.use('/pages/user/followed', p_postFollowed)
app.use('/pages/user/notifications', p_postNotifications)
app.use('/pages/user/profile', p_profile)
app.use('/pages/user/profile/view', p_profile_view)


// [HEROKU] Set Static Folder for Heroku //
if (process.env.NODE_ENV == 'production') {
	app.use(express.static('client/dist'))

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
	})
}


// [PORT + LISTEN] //
const port = config.PORT
server.listen(port, () => { console.log(`Server Running on Port: ${port}`) })