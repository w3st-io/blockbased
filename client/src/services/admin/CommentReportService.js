// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/admin/comment-reports',
		headers: {
			authorization: `Bearer ${localStorage.usertoken}`,
			authorization2: `Bearer ${localStorage.admintoken}`
		}
	})
}


/******************* [MARK-HANDLED-STATUS] *******************/
// [DELETE] Auth Required //
async function s_markHandled(report_id) {
	const authAxios = await this.authAxios()

	return new Promise ((resolve, reject) => {
		authAxios.get(`/mark-handled/${report_id}`)
			.then((res) => { resolve(res) })
			.catch((err) => { reject(err) })
	})
}


// [EXPORT] //
export default {
	authAxios,
	s_markHandled,
}