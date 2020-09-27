/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% MESSAGES UTILS %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [F] Format Message //
const formatMessage = (user_idFrom, user_idTo, text) => {
	return {
		from: user_idFrom,
		to: user_idTo,
		text: text,
		createdAt: new Date()
	}
}


// [F] Format Group Message //
const formatGroupMessage = (user_idFrom, text) => {
	return {
		from: user_idFrom,
		text: text,
		createdAt: new Date()
	}
}


// [EXPORT] //
module.exports = {
	formatMessage,
	formatGroupMessage
}
