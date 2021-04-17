// [IMPORT] //
import jwtDecode from 'jwt-decode'
import axios from 'axios'


// [IMPORT] Personal //
import { EventBus } from '../../main'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/admin',
		headers: {
			user_authorization: `Bearer ${localStorage.usertoken}`,
			admin_authorization: `Bearer ${localStorage.admintoken}`
		}
	})
}


/******************* [TOKEN-DECODE] *******************/
async function s_getAdminTokenDecodeData() {
	if (localStorage.admintoken) { return jwtDecode(localStorage.admintoken) }
	else {
		return {
			admin_id: '',
			role: '',
			email: '',
			username: '',
			first_name: '',
			last_name: '',
		}
	}
}


// [LOGIN] //
async function s_login(email, password) {
	try {
		const authAxios = await this.authAxios()
	
		const { data } = await authAxios.post('/login', { email, password })

		if (data.validation) {
			// [TOKEN] //
			localStorage.setItem('admintoken', data.token)
	
			// [EMIT] //
			EventBus.$emit('admin-logged-in')
		}

		return data
	}
	catch (err) {
		return {
			executed: true,
			status: false,
			message: `AdminService: Error --> ${err}`
		}
	}
}


// [LOGOUT] //
async function s_logout() {
	// [TOKEN] //
	localStorage.removeItem('admintoken')

	// [EMIT] //
	EventBus.$emit('admin-logged-out')
}


// [REGISTER] //
async function s_register({ username, email, password }) {
	try {
		const authAxios = await this.authAxios()
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
	s_logout,
	s_register,
}