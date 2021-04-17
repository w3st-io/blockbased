// [REQUIRE] Personal //
const socketUtil = require('../s-utils/socketUtil')


module.exports = {
	start: (io) => {
		io.on('connection', (socket) => {
			//console.log('[SOCKET] New Connected')
		

			// [EMIT] User //
			socket.emit('user', socketUtil.getUserSocket(socket.id))
		
		
			// [ON] User Join //
			socket.on('join', (user_id) => {
				// user_id exists & user_id not in room // 
				if (user_id && !socketUtil.getUserSocketByUserId(user_id)) {
					socketUtil.join(socket.id, user_id)
		
					// [EMIT-SOCKET] //
					socket.emit('user', socketUtil.getUserSocket(socket.id))

					// [EMIT-SOCKET] Broadcast usersOnline //
					socket.broadcast.emit('user', socketUtil.getUserSocket(socket.id))
					
					//console.log('[SOCKET] Join Room:', socketUtil.getAllUserSockets())
				}
			})
			
		
			// [ON] User Leave //
			socket.on('leave', () => {
				socketUtil.leave(socket.id)

				//console.log('[SOCKET] Leave Room:', socketUtil.getAllUserSockets())
			})
		
		
			// [ON] Disconnect //
			socket.on('disconnect', () => {
				socketUtil.leave(socket.id)

				//console.log('[SOCKET] Disconnected')
			})
		})
	}
}