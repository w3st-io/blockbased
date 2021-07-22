// [INIT] //
let sockets = []
let socketUsers = []
let socketsCoinbase = []


module.exports = {
	/************ [SOCKET] ************/
	// [JOIN] //
	joinSockets(socket_id) {
		console.log('Socket Joined:', socket_id)

		sockets.push(socket_id)
		
		return
	},

	
	/************ [SOCKET-USER] ************/
	// [JOIN] //
	joinSocketUsers: (socket_id, user_id) => {
		socketUsers.push({ socket_id, user_id })

		return
	},


	// [READ] By socket_id //
	getSocketUser: (socket_id) => {
		return socketUsers.find(uS => uS.socket_id === socket_id)
	},


	// [READ] By user_id //
	getSocketUserByUser_id: (user_id) => {
		return socketUsers.find(uS => uS.user_id == user_id)
	},


	/************ [COINBASE] ************/
	// [JOIN] //
	joinSocketsCoinbase: ({ socket_id, exchange, product_id }) => {
		socketsCoinbase.push({
			socket_id,
			exchange,
			product_id,
			created: new Date()
		})

		return
	},


	// [LEAVE] //
	leaveSocketsCoinbase: ({ socket_id }) => {
		// [SOCKETS-COINBASE] Get index --> Remove from socketsCoinbase //
		const sCIndex = socketsCoinbase.findIndex((uS) => uS.socket_id === socket_id)
		if (sCIndex !== -1) { socketsCoinbase.splice(sCIndex, 1)[0] }
	},


	/************ [EXIT] ************/
	userLogout: (socket_id) => {
		// Get Indexes of Specified "socket_id" //
		const uSIndex = socketUsers.findIndex((uS) => uS.socket_id === socket_id)
		
		// Remove user from userSocket //
		if (uSIndex !== -1) { socketUsers.splice(uSIndex, 1)[0] }
	},


	disconnected: (socket_id) => {
		console.log('Socket Left:', socket_id)

		// [SOCKET] Get index --> Remove from sockets //
		const sIndex = sockets.findIndex((s) => s === socket_id)
		if (sIndex !== -1) { sockets.splice(sIndex, 1)[0] }

		// [SOCKET-USERS] Get index --> Remove from socketUsers //
		const uSIndex = socketUsers.findIndex((uS) => uS.socket_id === socket_id)
		if (uSIndex !== -1) { socketUsers.splice(uSIndex, 1)[0] }

		// [SOCKETS-COINBASE] Get index --> Remove from socketsCoinbase //
		const sCIndex = socketsCoinbase.findIndex((uS) => uS.socket_id === socket_id)
		if (sCIndex !== -1) { socketsCoinbase.splice(sCIndex, 1)[0] }
	},


	/************ [ADMIN] ************/
	// [STATUS] //
	status: () => {
		return {
			sockets: sockets,
			socketUsers: socketUsers,
			socketsCoinbase: socketsCoinbase,
		}
	},
}