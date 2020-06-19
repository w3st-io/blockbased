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

	/******************* [USER PROFILE] *******************/
	// [TOKEN DECODE] //
	static getUserTokenDecodeData() {
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


	static async getUserProfileData(user_id) {
		let profileData = await axios.get(`/api/users/read/profile-data/${user_id}`)

		return profileData.data
	}

	static async updateUserProfileData(user_id, url) {
		console.log(user_id, url)
		return await axios.post(`/api/users/update/profile-data/${user_id}`,
			{ url }
		)
	}

	
	/******************* [USER LOGIN/REGISTER] *******************/
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