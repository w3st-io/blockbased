/**
 * %%%%%%%%%%%%%%%%%%%%%
 * %%% USER SERVICES %%%
 * %%%%%%%%%%%%%%%%%%%%%
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
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `UserService: Error --> ${err}`
			}
		}
	}
	else {
		try {
			const { data } = await authAxios.get('/read')

			return data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `UserService: Error --> ${err}`
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
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserService: Error --> ${err}`
		}
	}
	
}


/******************* [USER LOGIN/REGISTER] *******************/
// [LOGIN] //
async function login(email, password) {
	const authAxios = await this.authAxios()

	try {
		const { data } = await authAxios.post('/login', { email, password })
		
		return data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserService: Error --> ${err}`
		}
	}
}


// [REGISTER] //
async function register(username, email, password) {
	const authAxios = await this.authAxios()
	
	try {
		const { data } = await authAxios.post('/register', {
			username,
			email,
			password,
		})

		return data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserService: Error --> ${err}`
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
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserService: Error --> ${err}`
		}
	}
}


async function resendVerificationEmail(email) {
	const authAxios = await this.authAxios()

	try {
		const { data } = await authAxios.post('/resend-verification-email', { email })
		
		return data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserService: Error --> ${err}`
		}
	}
}


/******************* [PASSWORD] *******************/
async function requestPasswordReset(email) {
	const authAxios = await this.authAxios()

	try {
		const { data } = await authAxios.post('/request-password-reset', { email })

		console.log('requestPasswordReset', data)

		return data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserService: Error --> ${err}`
		}	
	}
}


async function resetPassword(user_id, verificationCode, password) {
	const authAxios = await this.authAxios()

	try {
		const { data } = await authAxios.post('/reset-password', {
			user_id,
			verificationCode,
			password
		})

		console.log('resetPassword', data)

		return data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserService: Error --> ${err}`
		}	
	}
}


/******************* [USER-PROFILE] *******************/
// [TOKEN DECODE] //
async function getUserTokenDecodeData() {
	let decoded = {
		_id: '',
		email: '',
		username: '',
	}

	if (localStorage.usertoken) {
		decoded = jwtDecode(localStorage.usertoken)
	}

	return decoded
}


// [EXPORT] //
export default {
	authAxios,
	s_read,
	s_update,
	login,
	register,
	verify,
	resendVerificationEmail,
	requestPasswordReset,
	resetPassword,
	getUserTokenDecodeData,
}