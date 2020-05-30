/**
 * %%%%%%%%%%%%%%%%%%%%% *
 * %%% USER SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%% *
*/
/*** [IMPORT] ***/
import jwtDecode from 'jwt-decode'
import axios from 'axios'

/*** [CLASS] UserService ***/
class UserService {
	// [FUNCTION] Get Email //
	static getEmail() {
		// [INIT] // Check For Token //
		const token = localStorage.usertoken
		let decoded = {}

		if (token != null) { decoded = jwtDecode(token) }
		else { decoded = { email: '' } }

		// [RETURN] //
		return decoded.email
	}
	
	// [FUNCTION] Login //
	static login(email, password) {
		/*** [PROMISE/POST] ***/
		let result = new Promise ((resolve, reject) => {
			axios.post('/api/users/login', { email, password })
				.then(res => { resolve(res) })
				.catch(err => { reject(err) })
		})

		// [RETURN] //
		return result
	}

	// [FUNCTION] Register //
	static register(first_name, last_name, username, email, password) {
		/*** [PROMISE/POST] ***/
		let result = new Promise ((resolve, reject) => {
			axios.post('/api/users/register', {
				first_name,
				last_name,
				username,
				email,
				password,
			})
				.then((res) => { resolve(res) })
				.catch((err) => { reject(err) })
		})

		// [RETURN] //
		return result
	}
}

/*** [EXPORT] ***/
export default UserService