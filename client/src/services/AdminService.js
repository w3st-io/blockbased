/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMIN SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import jwtDecode from 'jwt-decode'
import axios from 'axios'


class AdminService {
	// [AUTH-TOKEN-SETUP] //
	static async authAxios() {
		return axios.create({
			baseURL: '/api/admins',
			headers: {
				authorization: `Bearer ${localStorage.usertoken}`
			}
		})
	}


	// [TOKEN DECODE] //
	static getAdminTokenDecodeData() {
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
	static async login(email, password) {
		const authAxios = await this.authAxios()

		try { return await authAxios.post('/login', { email, password }) }
		catch(e) { return e }
	}

	
	// [REGISTER] //
	static async register(first_name, last_name, username, email, password) {
		const authAxios = await this.authAxios()

		try {
			return await authAxios.post('/register', {
				first_name,
				last_name,
				username,
				email,
				password,
			})
		}
		catch (e) {
			console.log(`Caught Error --> ${e}`)
			return e	
		}
	}
}

// [EXPORT] //
export default AdminService