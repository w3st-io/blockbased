/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% NOTIFICATION SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


class NotificationService {
	// [AUTH-TOKEN-SETUP] //
	static async authAxios() {
		return axios.create({
			baseURL: '/api/notifications',
			headers: {
				authorization: `Bearer ${localStorage.usertoken}`
			}
		})
	}

	/******************* [CRUD] *******************/
	static async readAll() {
		const authAxios = await this.authAxios()

		try {
			let res = await authAxios.get(`/read-all`)

			const notifications = res.data.map((notification) => ({
				...notification,
				createdAt: new Date(notification.createdAt).toLocaleString(),
			}))

			return notifications
		}
		catch (e) { return e }
	}


	/******************* [MARK-READ-STATUS] *******************/
	static async markRead(notification_id) {
		console.log(notification_id)
		const authAxios = await this.authAxios()

		try { return await authAxios(`/mark-read/${notification_id}`) }
		catch (e) { return e}
	}
}


// [EXPORT] //
export default NotificationService