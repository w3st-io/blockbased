// [REQUIRE] Personal //
const userUtils = require('../s-utils/userUtils')


// [EXPORT] //
module.exports = {
	start: (io) => {
		io.on('connection', (socket) => {
			// [LOG] //
			//console.log('New web-socket Connected')
		

			// [EMIT] User //
			socket.emit('user', userUtils.getUserSocket(socket.id))
		
		
			// [ON] User Join //
			socket.on('join', (user_id) => {
				// Check if user_id is not null & user_id isnt already in room
				if (user_id && !userUtils.getUserSocketByUserId(user_id)) {
					userUtils.join(socket.id, user_id)
		
					// [EMIT-SOCKET][EMIT-SOCKET-BROADCAST] usersOnline //
					socket.emit('user', userUtils.getUserSocket(socket.id))
		
					socket.broadcast.emit('user', userUtils.getUserSocket(socket.id))
				}
			})
			
		
			// [ON] User Leave //
			socket.on('leave', () => { userUtils.leave(socket.id) })
		
		
			// [ON] Disconnect //
			socket.on('disconnect', () => {
				userUtils.leave(socket.id)

				// [LOG] //
				//console.log('Web-socket Disconnected')
			})
		})
	}
}