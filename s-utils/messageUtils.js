// [FORMAT] Message //
const formatMessage = (user_idFrom, user_idTo, text) => {
	return {
		from: user_idFrom,
		to: user_idTo,
		text: text,
		created_at: new Date()
	}
}


// [FORMAT] Group Message //
const formatGroupMessage = (user_idFrom, text) => {
	return {
		from: user_idFrom,
		text: text,
		created_at: new Date()
	}
}


// [EXPORT] //
module.exports = {
	formatMessage,
	formatGroupMessage
}
