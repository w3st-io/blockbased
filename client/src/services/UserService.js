// [IMPORT] //
import jwtDecode from 'jwt-decode'
import axios from 'axios'


// [IMPORT] Personal //
import { EventBus } from '../main'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/users',
		headers: {
			authorization: `Bearer ${localStorage.usertoken}`,
			authorization2: `Bearer ${localStorage.admintoken}`
		}
	})
}


/******************* [TOKEN-DECODE] *******************/
async function s_getUserTokenDecodeData() {
	if (localStorage.usertoken) { return jwtDecode(localStorage.usertoken) }
	else {
		return {
			_id: '',
			email: '',
			username: '',
		}
	}
}


/******************* [CRUD] *******************/
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
async function s_login(email, password) {
	try {
		const authAxios = await this.authAxios()
		
		const { data } = await authAxios.post('/login', { email, password })
		
		
		if (data.validation) {
			// [TOKEN] //
			localStorage.setItem('usertoken', data.token)
	
			// [EMIT] //
			EventBus.$emit('user-logged-in')
		}

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


// [LOGOUT] //
async function s_logout() {
	// [TOKEN] //
	localStorage.removeItem('usertoken')

	// [EMIT] //
	EventBus.$emit('user-logged-out')
}


// [REGISTER] //
async function s_register(username, email, password) {
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
async function s_verify(user_id, verificationCode) {
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


async function s_resendVerificationEmail(email) {
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
async function s_resetPassword(currentPassword, password) {
	try {
		const authAxios = await this.authAxios()
		
		return (
			await authAxios.post('/change-password', { currentPassword, password })
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


async function s_requestPasswordReset(email) {
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


async function s_notLoggedResetPassword(user_id, verificationCode, password) {
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
		
		return (await authAxios.post('/report', { reportType, reportedUser })).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserService: Error --> ${err}`
		}	
	}
}


// [EXPORT] //
export default {
	authAxios,
	s_getUserTokenDecodeData,
	s_update,
	s_login,
	s_logout,
	s_register,
	s_verify,
	s_resetPassword,
	s_resendVerificationEmail,
	s_requestPasswordReset,
	s_notLoggedResetPassword,
	s_report,
}