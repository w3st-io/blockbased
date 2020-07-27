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
		return ['testing', 'this']
	}
}


// [EXPORT] //
export default NotificationService