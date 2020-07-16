/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMIN SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import jwtDecode from 'jwt-decode'
import axios from 'axios'


class AdminService {
	// [AUTH TOKEN SETUP] //
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

		let result = new Promise ((resolve, reject) => {
			authAxios.post('/login', { email, password })
				.then(res => { resolve(res) })
				.catch(err => { reject(err) })
		})

		return result
	}

	
	// [REGISTER] //
	static async register(first_name, last_name, username, email, password) {
		const authAxios = await this.authAxios()

		let result = new Promise ((resolve, reject) => {
			authAxios.post('/register', {
				first_name,
				last_name,
				username,
				email,
				password,
			})
				.then((res) => { resolve(res) })
				.catch((err) => {
					console.log('err:', err)
					reject(err)
				})
		})

		console.log('result', result)
		return result
	}
}

// [EXPORT] //
export default AdminService