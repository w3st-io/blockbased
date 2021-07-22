// [IMPORT] //
import jwtDecode from 'jwt-decode'
import axios from 'axios'


// [IMPORT] Personal //
import store from '@/store'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/user',
		headers: {
			user_authorization: `Bearer ${localStorage.usertoken}`,
			admin_authorization: `Bearer ${localStorage.admintoken}`
		}
	})
}


// [EXPORT] //
export default {
	authAxios,
	

	/******************* [TOKEN-DECODE] *******************/
	s_getUserTokenDecodeData: async function () {
		if (localStorage.usertoken) { return jwtDecode(localStorage.usertoken) }
		else {
			return {
				user_id: '',
				email: '',
				username: '',
			}
		}
	},


	/******************* [CRUD] *******************/
	// [UPDATE] Auth Required //
	s_update: async function (img_url, bio) {
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
	},


	/******************* [USER LOGIN/REGISTER] *******************/
		// [LOGIN] //
	s_login: async function (email, password) {
		try {
			const authAxios = await this.authAxios()
			
			const { data } = await authAxios.post('/login', { email, password })
			
			if (data.validation) {
				// [TOKEN] //
				localStorage.setItem('usertoken', data.token)
	
				// [STORE][JWT] Get decoded //
				store.state.user_decoded = jwtDecode(localStorage.usertoken)
	
				// [STORE] //
				store.state.userLogged = true
	
				// [STORE][SOCKET] //
				store.state.socket.emit('user-login', store.state.user_decoded.user_id)
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
	},


	// [LOGOUT] //
	s_logout: async function () {
		// [TOKEN] //
		localStorage.removeItem('usertoken')
		
		// [STORE][JWT] Get decoded //
		store.state.user_decoded = {}
	
		// [STORE] //
		store.state.userLogged = false
	
		// [EMIT] //
		store.state.socket.emit('user-logout')
	},


	// [REGISTER] //
	s_register: async function ({ username, email, password }) {
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
	},


	// [CHECK-IN] //
	s_checkIn: async function () {
		if (localStorage.usertoken) {
			// [STORE] //
			store.state.user_decoded = jwtDecode(localStorage.usertoken)
			store.state.userLogged = true
	
			// [STORE][SOCKET] //
			store.state.socket.emit(
				'user-login',
				store.state.user_decoded.user_id
			)
		}
	},
	

	/******************* [VERIFY] *******************/
	s_verify: async function (user_id, verificationCode) {
		try {
			const authAxios = await this.authAxios()
			
			return (
				await authAxios.post('/verify', { user_id, verificationCode })
			).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `UserService: Error --> ${err}`
			}
		}
	},


	s_resendVerificationEmail: async function (email) {
		try {
			const authAxios = await this.authAxios()
			
			return (
				await authAxios.post('/resend-verification-email', { email })
			).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `UserService: Error --> ${err}`
			}
		}
	},
	
	
	/******************* [PASSWORD] *******************/
	s_changePassword: async function (currentPassword, password) {
		try {
			const authAxios = await this.authAxios()
			
			return (
				await authAxios.post('/change-password', {
					currentPassword, password
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
	},


	s_requestResetPassword: async function (email) {
		try {
			const authAxios = await this.authAxios()
			
			return (await authAxios.post('/request-reset-password', { email })).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `UserService: Error --> ${err}`
			}	
		}
	},

	
	s_notLoggedResetPassword: async function (user_id, verificationCode, password) {
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
	},


	s_report: async function (reportType, reportedUser) {
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
	},
}