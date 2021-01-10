// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/admin/posts',
		headers: {
			authorization: `Bearer ${localStorage.usertoken}`,
			authorization2: `Bearer ${localStorage.admintoken}`
		}
	})
}


/******************* [CRUD] *******************/
// [DELETE] Auth Required //
async function s_delete(post_id) {
	const authAxios = await this.authAxios()

	const result = new Promise ((resolve, reject) => {
		authAxios.delete(`/delete/${post_id}`)
			.then((res) => { resolve(res) })
			.catch((err) => { reject(err) })
	})

	return result
}


// [EXPORT] //
export default {
	authAxios,
	s_delete,
}