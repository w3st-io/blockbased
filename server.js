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
const a_admin_posts = require('./s-routes/api/admin/posts')
const a_admin_commentReports = require('./s-routes/api/admin/comment-reports')
const a_admin_comments = require('./s-routes/api/admin/comments')
const a_admin_users = require('./s-routes/api/admin/users')
const a_admins = require('./s-routes/api/admins')
const a_posts = require('./s-routes/api/posts')
const a_comments = require('./s-routes/api/comments')
const a_notifications = require('./s-routes/api/notifications')
const a_users = require('./s-routes/api/users')

const p_ = require ('./s-routes/pages')
const p_activity = require('./s-routes/pages/activity')
const p_admin = require('./s-routes/pages/admin')
const p_admin_function_commentReports = require('./s-routes/pages/admin/function/comment-reports')
const p_admin_function_comments = require('./s-routes/pages/admin/function/comments')
const p_admin_function_posts = require('./s-routes/pages/admin/function/posts')
const p_admin_function_users = require('./s-routes/pages/admin/function/users')
const p_cat = require('./s-routes/pages/cat')
const p_comment_create = require('./s-routes/pages/comment/create')
const p_comment_edit = require('./s-routes/pages/comment/edit')
const p_comment_reply = require('./s-routes/pages/comment/reply')
const p_post = require('./s-routes/pages/post')
const p_post_create = require('./s-routes/pages/post/create')
const p_user_activity = require('./s-routes/pages/user/activity')
const p_user_activity_lookup = require('./s-routes/pages/user/activity/lookup')
const p_user_followed = require('./s-routes/pages/user/followed')
const p_user_notifications = require('./s-routes/pages/user/notifications')
const p_user_profile = require('./s-routes/pages/user/profile')
const p_user_profile_lookup = require('./s-routes/pages/user/profile/lookup')
const p_search = require('./s-routes/pages/search')

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
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	},
	(err, connected) => {
		if (connected) { console.log('Mongoose Connected to DB') }
		else { console.log(`Mongoose Connection Error --> ${err}`) }
	}
)


// [USE] //
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())


// [USE] Personal - Rate-Limiter / API / Pages //
app.use(rateLimiter.limiter)

app.use('/api', a_)
app.use('/api/admin/posts', a_admin_posts)
app.use('/api/admin/comment-reports', a_admin_commentReports)
app.use('/api/admin/comments', a_admin_comments)
app.use('/api/admin/users', a_admin_users)
app.use('/api/admins', a_admins)
app.use('/api/posts', a_posts)
app.use('/api/comments', a_comments)
app.use('/api/notifications', a_notifications)
app.use('/api/users', a_users)

app.use('/pages', p_)
app.use('/pages/activity', p_activity)
app.use('/pages/admin', p_admin)
app.use('/pages/admin/function/commentReports', p_admin_function_commentReports)
app.use('/pages/admin/function/comments', p_admin_function_comments)
app.use('/pages/admin/function/posts', p_admin_function_posts)
app.use('/pages/admin/function/users', p_admin_function_users)
app.use('/pages/cat', p_cat)
app.use('/pages/comment/create', p_comment_create)
app.use('/pages/comment/edit', p_comment_edit)
app.use('/pages/comment/reply', p_comment_reply)
app.use('/pages/post', p_post)
app.use('/pages/post/create', p_post_create)
app.use('/pages/user/activity', p_user_activity)
app.use('/pages/user/activity/lookup', p_user_activity_lookup)
app.use('/pages/user/followed', p_user_followed)
app.use('/pages/user/notification', p_user_notifications)
app.use('/pages/user/profile', p_user_profile)
app.use('/pages/user/profile/lookup', p_user_profile_lookup)
app.use('/pages/search', p_search)


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