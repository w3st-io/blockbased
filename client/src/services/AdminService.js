/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMIN SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import jwtDecode from 'jwt-decode'
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/admins',
		headers: { authorization: `Bearer ${localStorage.usertoken}` }
	})
}


// [TOKEN DECODE] //
function getAdminTokenDecodeData() {
	let decoded = {}

	if (localStorage.admintoken) {
		decoded = jwtDecode(localStorage.admintoken)
	}
	else {
		decoded = {
			_id: '',
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
async function login(email, password) {
	const authAxios = await this.authAxios()
	
	try {
		const returned = await authAxios.post('/login', { email, password })

		return returned.data
	}
	catch (e) {
		return {
			executed: true,
			status: false,
			message: `AdminService: Error --> ${e}`
		}
	}
}


// [REGISTER] //
async function register(first_name, last_name, username, email, password) {
	const authAxios = await this.authAxios()
	let returned = ''

	try {
		returned = await authAxios.post('/register', {
			first_name,
			last_name,
			username,
			email,
			password,
		})

		return returned.data
	}
	catch (e) {
		return {
			executed: true,
			status: false,
			message: `AdminService: Error --> ${e}`,
		}
	}
}


// [EXPORT] //
export default {
	authAxios,
	getAdminTokenDecodeData,
	login,
	register,
}