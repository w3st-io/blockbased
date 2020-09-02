/**
 * %%%%%%%%%%%%%%%%%%%%% *
 * %%% USER SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import jwtDecode from 'jwt-decode'
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/users',
		headers: { authorization: `Bearer ${localStorage.usertoken}` }
	})
}


/******************* [CRUD] *******************/
// [READ] //
async function s_read(user_id) {
	const authAxios = await this.authAxios()
	
	if (user_id) {
		try {
			const { data } = await authAxios.get(`/read/${user_id}`)

			return data
		}
		catch (e) {
			return {
				executed: false,
				status: false,
				message: `UserService: Caught Error --> ${e}`
			}
		}
	}
	else {
		try {
			const { data } = await authAxios.get('/read')

			return data
		}
		catch (e) {
			return {
				executed: false,
				status: false,
				message: `UserService: Caught Error --> ${e}`
			}
		}
	}
}

// [UPDATE] Auth Required //
async function s_update(img_url) {
	const authAxios = await this.authAxios()

	try {
		const { data } = await authAxios.post(`/update`, { img_url })

		return data
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `UserService: Caught Error --> ${e}`
		}
	}
	
}


/******************* [USER-PROFILE] *******************/
// [TOKEN DECODE] //
async function getUserTokenDecodeData() {
	let decoded

	if (localStorage.usertoken) {
		decoded = jwtDecode(localStorage.usertoken)
	}
	else {
		decoded = {
			_id: '',
			email: '',
			username: '',
			first_name: '',
			last_name: '',
		}
	}

	return decoded
}


/******************* [USER LOGIN/REGISTER] *******************/
// [LOGIN] //
async function login(email, password) {
	const authAxios = await this.authAxios()

	try {
		const { data } = await authAxios.post('/login', { email, password })
		
		return data
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `UserService: Caught Error --> ${e}`
		}
	}
}


// [REGISTER] //
async function register(first_name, last_name, username, email, password) {
	const authAxios = await this.authAxios()
	
	try {
		const { data } = await authAxios.post('/register', {
			first_name,
			last_name,
			username,
			email,
			password,
		})

		console.log('data', data)

		return data
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `UserService: Caught Error --> ${e}`
		}
	}
}


/******************* [VERIFY] *******************/
async function verify(user_id, verificationCode) {
	const authAxios = await this.authAxios()

	try {
		const { data } = await authAxios.post('/verify', {
			user_id,
			verificationCode,
		})
		
		return data
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `UserService: Caught Error --> ${e}`
		}
	}
}


// [EXPORT] //
export default {
	authAxios,
	s_read,
	s_update,
	getUserTokenDecodeData,
	login,
	register,
	verify,
}