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
	const authAxios = await this.authAxios()

	try {
		let { data } = await authAxios.get(`/read-all-unread`)

		data.notifications.forEach(notification => {
			notification.createdAt = new Date(notification.createdAt).toLocaleString()
		})

		return data.notifications
	}
	catch (err) { return err }
}


/******************* [MARK-READ-STATUS] *******************/
async function markRead(notification_id) {
	const authAxios = await this.authAxios()

	try { return await authAxios(`/mark-read/${notification_id}`) }
	catch (err) { return err }
}


// [EXPORT] //
export default {
	authAxios,
	s_readAllUnread,
	markRead,
}