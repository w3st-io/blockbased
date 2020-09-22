/**
 * %%%%%%%%%%%%%% *
 * %%% SERVER %%% *
 * %%%%%%%%%%%%%% *
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


// [REQUIRE] Personal - API - Pages - Socket //
const admininstrationPosts = require('./s-routes/api/administration/posts')
const admininstrationComments = require('./s-routes/api/administration/comments')
const admininstrationReports = require('./s-routes/api/administration/reports')
const admininstrationUsers = require('./s-routes/api/administration/users')
const admins = require('./s-routes/api/admins')
const posts = require('./s-routes/api/posts')
const comments = require('./s-routes/api/comments')
const rateLimiter = require('./s-rate-limiters')
const notifications = require('./s-routes/api/notifications')
const users = require('./s-routes/api/users')


const p_ = require ('./s-routes/pages')
const p_admin = require('./s-routes/pages/admin')
const p_cat = require('./s-routes/pages/cat')
const p_post = require('./s-routes/pages/post')
const p_profile = require('./s-routes/pages/profile')
const p_profile_view = require('./s-routes/pages/profile/view')

const s_socket = require('./s-socket')


// [INIT] Const //
const port = process.env.PORT || 5000
const base_url = process.env.BASE_URL || `http://localhost:${port}`
const mongo_uri = process.env.MONGO_URI || 'mongodb://localhost:27017'


// [MONGOOSE-CONNECTION] //
mongoose.connect(
	mongo_uri,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	(err, connected) => {
		if (connected) { console.log('Mongoose Connected to DB') }
		else { console.log(`Mongoose Connection Error --> ${err}`) }
	}
)
mongoose.set('useFindAndModify', false)


// [EXPRESS + SERVER] //
const app = express()
const server = http.createServer(app)

// [SOCKET] //
const io = socketIO.listen(server)
s_socket.start(io)
app.io = io

// [USE] //
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(rateLimiter.limiter)


// [USE] Personal - API - Pages //
app.use('/api/administration/posts', admininstrationPosts)
app.use('/api/administration/comments', admininstrationComments)
app.use('/api/administration/reports', admininstrationReports)
app.use('/api/administration/users', admininstrationUsers)
app.use('/api/admins', admins)
app.use('/api/posts', posts)
app.use('/api/comments', comments)
app.use('/api/notifications', notifications)
app.use('/api/users', users)

app.use('/pages', p_)
app.use('/pages/admin', p_admin)
app.use('/pages/cat', p_cat)
app.use('/pages/post', p_post)
app.use('/pages/profile', p_profile)
app.use('/pages/profile/view', p_profile_view)


// [HEROKU] Set Static Folder for Heroku //
if (process.env.NODE_ENV == 'production') {
	app.use(express.static('client/dist'))

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
	})
}


// [MAIN-ROUTE] //
app.get('/api', async (req, res) => { res.send('API') })

	
// [BASE-URL-ROUTE] For the socket //
app.get('/api/get-base-url', async (req, res) => { res.send(base_url) })


// [LISTEN] //
server.listen(port, () => { console.log(`Server Running on Port: ${port}`) })