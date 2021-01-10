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
	try {
		const authAxios = await this.authAxios()
	
		if (user_id) { return (await authAxios.get(`/read/${user_id}`)).data }
		else { return (await authAxios.get('/read')).data }
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserService: Error --> ${err}`
		}
	}
}

// [UPDATE] Auth Required //
async function s_update(img_url, bio) {
	try {
		const authAxios = await this.authAxios()
		
		return (await authAxios.post('/update', { img_url, bio })).data
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
	try {
		const authAxios = await this.authAxios()
		
		return (await authAxios.post('/login', { email, password })).data
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
	try {
		const authAxios = await this.authAxios()
		
		return (await authAxios.post('/register', { username, email, password })).data
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
	try {
		const authAxios = await this.authAxios()
		
		return (await authAxios.post('/verify', { user_id, verificationCode })).data
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
	try {
		const authAxios = await this.authAxios()
		
		return (await authAxios.post('/resend-verification-email', { email })).data
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
	try {
		const authAxios = await this.authAxios()
		
		return (await authAxios.post('/request-password-reset', { email })).data
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
	try {
		const authAxios = await this.authAxios()
		
		return (
			await authAxios.post('/reset-password', {
				user_id,
				verificationCode,
				password
			})
		).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserService: Error --> ${err}`
		}	
	}
}


async function s_report(reportType, reportedUser) {
	try {
		const authAxios = await this.authAxios()
		
		return (
			await authAxios.post('/report', { reportType, reportedUser })
		).data
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

	if (localStorage.usertoken) { decoded = jwtDecode(localStorage.usertoken) }

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
	s_report,
	getUserTokenDecodeData,
}