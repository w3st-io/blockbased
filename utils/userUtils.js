/**
 * %%%%%%%%%%%%%%%%%% *
 * %%% USER UTILS %%% *
 * %%%%%%%%%%%%%%%%%% *
*/
// [INIT] //
const userSockets = []


/************ [CRUD] userSockets ************/
// [CREATE] Add User to allUsers //
function join(socket_id, user_id) {
	const userSocket = { socket_id, user_id, }
	userSockets.push(userSocket)

	console.log('[JOIN] userSockets:', userSockets)

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


/************ [CRUD][BOTH] ************/
// [DELETE] User leaves chat //
function leave(socket_id) {
	// Get Indexs of Specified "socket_id" //
	const uSIndex = userSockets.findIndex((uS) => uS.socket_id === socket_id)
	
	// Remove User From "userSocketIndex" //
	if (uSIndex !== -1) {
		const userSocket = userSockets.splice(uSIndex, 1)[0]
		
		// [LOG] //
		console.log('[LEAVE] userSockets:', userSockets)
	
		return userSocket
	}
}


// [EXPORT] //
module.exports = {
	join,
	getUserSocket,
	getUserSocketByUserId,
	getAllUserSockets,
	leave,
}