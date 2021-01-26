// [INIT] //
const userSockets = []
const userSocketsInRooms = []


/************ [CRUD] userSockets ************/
// [CREATE] Add User to userSockets //
function join(socket_id, user_id) {
	const userSocket = { socket_id, user_id }
	userSockets.push(userSocket)

	//console.log('[JOINED-USERSOCKETS]:', userSockets)

	return userSocket
}

// [READ] socket_id //
function getUserSocket(socket_id) {
	return userSockets.find(uS => uS.socket_id === socket_id)
}

// [READ] user_id //
function getUserSocketByUserId(user_id) {
	return userSockets.find(uS => uS.user_id == user_id)
}

// [READ-ALL] //
function getAllUserSockets() { return userSockets }


/************ [CRUD][ROOM] userSocketsInRoom ************/
// [CREATE] Join Room //
function joinRoom(socket_id, user_id, room) {
	const userSocket = { socket_id, user_id, room }
	userSocketsInRooms.push(userSocket)

	//console.log('[JOINROOM] userSocketsInRooms:', userSocketsInRooms)

	return userSocket
}

// [READ] //
function getUserSocketInRoom(socket_id) {
	return userSocketsInRooms.find(uSIR => uSIR.socket_id === socket_id)
}

// [READ-ALL] Within Specified Room //
function getAllUserSocketsInRoom(room) {
	return userSocketsInRooms.filter(uSIR => uSIR.room === room)
}


/************ [CRUD][BOTH] ************/
// [DELETE] User leaves chat //
function leave(socket_id) {
	// Get Indexs of Specified "socket_id" //
	const uSIndex = userSockets.findIndex((uS) => uS.socket_id === socket_id)
	const uSIRIndex = userSocketsInRooms.findIndex(
		(uSIR) => uSIR.socket_id === socket_id
	)
	
	// Remove User From "userSocketInRoomIndex" & "userSocketIndex" //
	if (uSIRIndex !== -1) { userSocketsInRooms.splice(uSIRIndex, 1)[0] }
	if (uSIndex !== -1) {
		const userSocket = userSockets.splice(uSIndex, 1)[0]
		
		// [LOG] //
		//console.log('[LEAVE] userSockets:', userSockets)
		//console.log('[LEAVE] userSocketsInRooms:', userSocketsInRooms)
	
		return userSocket
	}
}


// [EXPORT] //
module.exports = {
	join,
	getUserSocket,
	getUserSocketByUserId,
	getAllUserSockets,
	joinRoom,
	getUserSocketInRoom,
	getAllUserSocketsInRoom,
	leave,
}