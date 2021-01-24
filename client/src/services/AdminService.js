// [IMPORT] //
import jwtDecode from 'jwt-decode'
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/admins',
		headers: {
			authorization: `Bearer ${localStorage.usertoken}`,
			authorization2: `Bearer ${localStorage.admintoken}`
		}
	})
}


/******************* [TOKEN-DECODE] *******************/
async function s_getAdminTokenDecodeData() {
	let decoded = {}

	if (localStorage.admintoken) {
		decoded = jwtDecode(localStorage.admintoken)
	}
	else {
		decoded = {
			admin_id: '',
			role: '',
			email: '',
			username: '',
			first_name: '',
			last_name: '',
		}
	}

	return decoded
}


// [LOGIN] //
async function s_login(email, password) {
	const authAxios = await this.authAxios()
	
	try { return (await authAxios.post('/login', { email, password })).data }
	catch (err) {
		return {
			executed: true,
			status: false,
			message: `AdminService: Error --> ${err}`
		}
	}
}


// [REGISTER] //
async function s_register(username, email, password) {
	const authAxios = await this.authAxios()
	try {
		return (
			await authAxios.post('/register', { username, email, password, })
		).data
	}
	catch (err) {
		return {
			executed: true,
			status: false,
			message: `AdminService: Error --> ${err}`,
		}
	}
}


// [EXPORT] //
export default {
	authAxios,
	s_getAdminTokenDecodeData,
	s_login,
	s_register,
}