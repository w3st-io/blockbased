/**
 * %%%%%%%%%%%%%%%%%%%%% *
 * %%% USER SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import jwtDecode from 'jwt-decode'
import axios from 'axios'

/*** [CLASS] UserService ***/
class UserService {
	// [READ] Get User Profile Data //
	static getUserProfileData() {
		let decoded = {}

		if (localStorage.usertoken) {
			decoded = jwtDecode(localStorage.usertoken)
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
			axios.post('/api/users/login', { email, password })
				.then(res => { resolve(res) })
				.catch(err => { reject(err) })
		})

		return result
	}

	
	// [REGISTER] //
	static register(first_name, last_name, username, email, password) {
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

		return result
	}
}

// [EXPORT] //
export default UserService