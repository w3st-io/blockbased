// [REQUIRE] Personal //
const socketUtil = require('../s-utils/socketUtil')


// [EXPORT] //
module.exports = {
	start: (io) => {
		io.on('connection', (socket) => {
			// [LOG] //
			//console.log('New web-socket Connected')
		

			// [EMIT] User //
			socket.emit('user', socketUtil.getUserSocket(socket.id))
		
		
			// [ON] User Join //
			socket.on('join', (user_id) => {
				console.log('socket-join user_id:', user_id)

				// Check if user_id is not null & user_id isnt already in room
				if (user_id && !socketUtil.getUserSocketByUserId(user_id)) {

					socketUtil.join(socket.id, user_id)
		
					// [EMIT-SOCKET][EMIT-SOCKET-BROADCAST] usersOnline //
					socket.emit('user', socketUtil.getUserSocket(socket.id))

					socket.broadcast.emit('user', socketUtil.getUserSocket(socket.id))
					
					// [LOG] //
					//console.log('Sockets In Room:', socketUtil.getAllUserSockets())
				}
			})
			
		
			// [ON] User Leave //
			socket.on('leave', () => {
				socketUtil.leave(socket.id)

				// [LOG] //
				//console.log('Sockets In Room:', socketUtil.getAllUserSockets())
			})
		
		
			// [ON] Disconnect //
			socket.on('disconnect', () => {
				socketUtil.leave(socket.id)

				// [LOG] //
				//console.log('Web-socket Disconnected')
			})
		})
	}
}