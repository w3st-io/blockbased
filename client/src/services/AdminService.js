/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMIN SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import jwtDecode from 'jwt-decode'
import axios from 'axios'

class AdminService {
	// [FUNCTION] Get User Profile Stuff //
	static getAdminTokenDecodeData() {
		let decoded = {}

		if (localStorage.admintoken) {
			decoded = jwtDecode(localStorage.admintoken)
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
	

	// [LOGIN] //
	static login(email, password) {
		let result = new Promise ((resolve, reject) => {
			axios.post('/api/admins/login', { email, password })
				.then(res => { resolve(res) })
				.catch(err => { reject(err) })
		})

		return result
	}

	
	// [REGISTER] //
	static register(first_name, last_name, username, email, password) {
		let result = new Promise ((resolve, reject) => {
			axios.post('/api/admins/register', {
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

		return result
	}
}

// [EXPORT] //
export default AdminService