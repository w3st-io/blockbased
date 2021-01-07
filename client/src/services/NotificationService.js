/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
 * %%% NOTIFICATION SERVICES %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/notifications',
		headers: { authorization: `Bearer ${localStorage.usertoken}` }
	})
}

/******************* [OTHER-CRUD] *******************/
async function s_readUnread(sort, limit, page) {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.get(`/read-unread/${sort}/${limit}/${page}`)).data
	}
	catch (err) { return err }
}


/******************* [MARK-READ-STATUS] *******************/
async function s_markRead(notification_id) {
	try {
		const authAxios = await this.authAxios()

		return await authAxios(`/mark-read/${notification_id}`)
	}
	catch (err) { return err }
}


// [EXPORT] //
export default {
	authAxios,
	s_readUnread,
	s_markRead,
}