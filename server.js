// [REQUIRE] //
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const http = require('http')
const mongoose = require('mongoose')
const path = require('path')
const socketIO = require('socket.io')


// [REQUIRE] Personal // Other // API // Pages //
const coinbase_WS = require('./s-api/coinbase/webSocket')
const finnhub = require('./s-api/finnhub')
const config = require('./s-config')
const Functionality = require('./s-middleware/Functionality')
const rateLimiter = require('./s-rate-limiters')
const s_socket = require('./s-socket')

const a_ = require('./s-routes/api')
const a_admin = require('./s-routes/api/admin')
const a_admin_commentReport = require('./s-routes/api/admin/comment-report')
const a_admin_comment = require('./s-routes/api/admin/comment')
const a_admin_post = require('./s-routes/api/admin/post')
const a_admin_user = require('./s-routes/api/admin/user')
const a_coinbase = require('./s-routes/api/coinbase')
const a_mail = require('./s-routes/api/mail')
const a_user = require('./s-routes/api/user')
const a_user_comment = require('./s-routes/api/user/comment')
const a_user_notification = require('./s-routes/api/user/notification')
const a_user_post = require('./s-routes/api/user/post')
const a_socket = require('./s-routes/api/socket')

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
const p_followed = require('./s-routes/pages/followed')
const p_notification = require('./s-routes/pages/notification')
const p_post = require('./s-routes/pages/post')
const p_post_create = require('./s-routes/pages/post/create')
const p_search = require('./s-routes/pages/search')
const p_user_activity = require('./s-routes/pages/user/activity')
const p_user_activity_lookup = require('./s-routes/pages/user/activity/lookup')
const p_user_profile = require('./s-routes/pages/user/profile')
const p_user_profile_edit = require('./s-routes/pages/user/profile/edit')
const p_user_profile_lookup = require('./s-routes/pages/user/profile/lookup')


// [INIT] Const //
const port = config.PORT


// [EXPRESS] //
const app = express()


// [SERVER] Upgrade app to server //
const server = http.createServer(app)


// [SOCKET.IO] //
const io = socketIO(
	server,
	{
		allowEIO3: true,
		cors: {
			origin: config.CLIENT_BASE_URL,
			methods: ['GET', 'POST'],
			allowedHeaders: ['my-custom-header'],
			credentials: true
		}
	}
)


// [SOCKET.IO] //
s_socket.start(io)


// [SET] //
app.set('socketio', io)


// [COINBASE] WS //
coinbase_WS.start(io)


// [FINNHUB] //
finnhub.updateNews()
setInterval(function () { finnhub.updateNews() }, 1000 * 60 * 5);


// [MONGOOSE-CONNECTION] //
mongoose.connect(
	config.MONGO_URI,
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


// [USE] // Set static Folder // Rate-Limiter //
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static(__dirname + '/s-static'))
app.use(rateLimiter.limiter)


// [USE] Personal - API //
app.use('/api', a_)
app.use('/api/admin', Functionality.admin(), a_admin)
app.use('/api/admin/comment-report', Functionality.admin(), a_admin_commentReport)
app.use('/api/admin/comment', Functionality.admin(), a_admin_comment)
app.use('/api/admin/post', Functionality.admin(), a_admin_post)
app.use('/api/admin/user', Functionality.admin(), a_admin_user)
app.use('/api/coinbase', a_coinbase)
app.use('/api/mail', a_mail)
app.use('/api/user', Functionality.user(), a_user)
app.use('/api/user/comment', Functionality.comments(), a_user_comment)
app.use('/api/user/notification', Functionality.user(), a_user_notification)
app.use('/api/user/post', Functionality.posts(), a_user_post)
app.use('/api/socket', a_socket)

// [USE] Personal - Pages //
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
app.use('/pages/followed', p_followed)
app.use('/pages/notification', p_notification)
app.use('/pages/post', p_post)
app.use('/pages/post/create', p_post_create)
app.use('/pages/search', p_search)
app.use('/pages/user/activity', p_user_activity)
app.use('/pages/user/activity/lookup', p_user_activity_lookup)
app.use('/pages/user/profile', p_user_profile)
app.use('/pages/user/profile/edit', p_user_profile_edit)
app.use('/pages/user/profile/lookup', p_user_profile_lookup)


// [HEROKU] Set Static Folder for Heroku //
if (config.NODE_ENV == 'production') {
	app.use(express.static('client/dist'))

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
	})
}


// [LISTEN] //
server.listen(port, () => { console.log(`Server Running on Port: ${port}`) })