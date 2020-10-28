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
async function s_readAllUnread() {
	try {
		const authAxios = await this.authAxios()

		const { data } = await authAxios.get(`/read-all-unread`)

		return data.notifications
	}
	catch (err) { return err }
}


/******************* [MARK-READ-STATUS] *******************/
async function markRead(notification_id) {
	try {
		const authAxios = await this.authAxios()

		return await authAxios(`/mark-read/${notification_id}`)
	}
	catch (err) { return err }
}


// [EXPORT] //
export default {
	authAxios,
	s_readAllUnread,
	markRead,
}