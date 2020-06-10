/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMIN SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
/*** [IMPORT] ***/
import jwtDecode from 'jwt-decode'
import axios from 'axios'

/*** [CLASS] AdminService ***/
class AdminService {
	// [FUNCTION] Get Email //
	static getEmail() {
		const token = localStorage.admintoken
		let decoded = {}

		if (token != null) { decoded = jwtDecode(token) }
		else { decoded = { email: '' } }

		return decoded.email
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
				.then(res => { resolve(res) })
				.catch(err => {
					console.log('err:', err)
					reject(err)
				})
		})

		return result
	}
}

/*** [EXPORT] ***/
export default AdminService