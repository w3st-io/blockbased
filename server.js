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


// [REQUIRE] Personal - API - Pages - Utils //
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

const userUtils = require('./s-utils/userUtils')


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
		if(connected) { console.log('Mongoose Connected to DB') }
		else { console.log(`Mongoose Connection Error --> ${err}`) }
	}
)
mongoose.set('useFindAndModify', false)


// [EXPRESS + SERVER] //
const app = express()
const server = http.createServer(app)


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


// [SOCKET + ON/EMIT] //
const io = new socketIO(server)
io.on('connection', (socket) => {
	// [LOG] //
	//console.log('New WS connected')


	// [EMIT] usersOnline //
	socket.emit('user', userUtils.getUserSocket(socket.id))


	// [ON] join //
	socket.on('join', (user_id) => {
		// Check if user_id is not null & user_id isnt already in room
		if (user_id && !userUtils.getUserSocketByUserId(user_id)) {
			userUtils.join(socket.id, user_id)

			// [EMIT-SOCKET] usersOnline //
			socket.emit('user', userUtils.getUserSocket(socket.id))

			// [EMIT-SOCKET-BROADCAST] usersOnline //
			socket.broadcast.emit('user', userUtils.getUserSocket(socket.id))
		}
	})

	
	// [ON] leave //
	socket.on('leave', () => { userUtils.leave(socket.id) })


	// [ON] comment-created //
	socket.on('comment-created', (followers) => {
		if (followers) {
			followers.forEach(follower => {
				// Get userSicket by user_id
				const userSocket = userUtils.getUserSocketByUserId(follower)

				// [EMIT] //
				if (userSocket) io.to(userSocket.socket_id).emit('update-notification')
			})
		}
	})

	
	// [ON] Disconnect //
	socket.on('disconnect', () => {
		// [LOG] //
		//console.log('WS Closed')

		// Leave variable
		userUtils.leave(socket.id)
	})
})


// [MAIN-ROUTE] //
app.get('/api', async (req, res) => { res.send('API') })


// [BASE-URL-ROUTE] For the socket //
app.get('/api/get-base-url', async (req, res) => { res.send(base_url) })


// [HEROKU] Set Static Folder for Heroku //
if (process.env.NODE_ENV == 'production') {
	app.use(express.static('client/dist'))

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
	})
}


// [LISTEN] //
server.listen(port, () => { console.log(`Server Running on Port: ${port}`) })