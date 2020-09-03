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
const socketIO = require('socket.io')
require('dotenv').config()


// [REQUIRE] Personal //
const admins = require('./routes/api/admins')
const posts = require('./routes/api/posts')
const comments = require('./routes/api/comments')
const rateLimiter = require('./rate-limiters')
const notifications = require('./routes/api/notifications')
const users = require('./routes/api/users')
const userUtils = require('./utils/userUtils')


// [REQUIRE] Personal - Administration //
const admininstrationPosts = require('./routes/api/administration/posts')
const admininstrationComments = require('./routes/api/administration/comments')
const admininstrationReports = require('./routes/api/administration/reports')
const admininstrationUsers = require('./routes/api/administration/users')


// [MONGOOSE-CONNECTION] //
mongoose.connect(
	process.env.MONGO_URI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	(e, connected) => {
		if(connected) { console.log('Mongoose Connected to DB') }
		else { console.log(`Mongoose Connection Error --> ${e}`) }
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


// [USE] Personal //
app.use('/api/admins', admins)
app.use('/api/posts', posts)
app.use('/api/comments', comments)
app.use('/api/notifications', notifications)
app.use('/api/users', users)


// [USE] Personal - Administration //
app.use('/api/administration/posts', admininstrationPosts)
app.use('/api/administration/comments', admininstrationComments)
app.use('/api/administration/reports', admininstrationReports)
app.use('/api/administration/users', admininstrationUsers)


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


// [PORT + LISTEN] //
const port = process.env.PORT || 5000
server.listen(port, () => { console.log(`Server Running on Port: ${port}`) })


// [MAIN ROUTE] //
app.get('', async (req, res) => {
	res.send('<h1 style="color: #f45d22;">BlockBased.io API</h1>')
})