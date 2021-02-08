// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api',
		headers: {
			authorization: `Bearer ${localStorage.usertoken}`,
			authorization2: `Bearer ${localStorage.admintoken}`
		}
	})
}

async function index() {
	const authAxios = await this.authAxios()

	const { data } = await authAxios.get('/')
	
	return data
}


// [EXPORT] //
export default {
	authAxios,
	index,
}