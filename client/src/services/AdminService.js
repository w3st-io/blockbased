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

		// [RETURN] //
		return decoded.email
	}
	
	// [FUNCTION] Login //
	static login(email, password) {
		let result = new Promise ((resolve, reject) => {
			axios.post('/api/admins/login', { email, password })
				.then(res => { resolve(res) })
				.catch(err => { reject(err) })
		})

		console.log('result', result)
		// [RETURN] //
		return result
	}

	// [FUNCTION] Register //
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

		// [RETURN] //
		return result
	}
}

/*** [EXPORT] ***/
export default AdminService