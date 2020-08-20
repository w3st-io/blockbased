/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% NOTIFICATION SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
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

/******************* [CRUD] *******************/
async function s_readAll() {
	const authAxios = await this.authAxios()

	try {
		let { data } = await authAxios.get(`/read-all`)

		data.notifications.forEach(notification => {
			notification.createdAt = new Date(notification.createdAt).toLocaleString()
		})

		return data.notifications
	}
	catch (e) { return e }
}


/******************* [MARK-READ-STATUS] *******************/
async function markRead(notification_id) {
	const authAxios = await this.authAxios()

	try { return await authAxios(`/mark-read/${notification_id}`) }
	catch (e) { return e }
}


// [EXPORT] //
export default {
	authAxios,
	s_readAll,
	markRead,
}