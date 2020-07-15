/**
 * %%%%%%%%%%%%%%%%%%%%% *
 * %%% USER SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import jwtDecode from 'jwt-decode'
import axios from 'axios'


// [AUTH TOKEN SETUP] //
const token = localStorage.usertoken
const authAxios = axios.create({
	baseURL: '/api/users',
	headers: {
		authorization: `Bearer ${token}`
	}
})


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


	// [READ] //
	static async getUserProfileData() {
		const profileData = await authAxios.get(`/read`)

		return profileData.data
	}


	// [UPDATE] //
	static async updateUserProfileData(img_url) {
		return await authAxios.post(`/update`, { img_url })
	}

	
	/******************* [USER LOGIN/REGISTER] *******************/
	// [LOGIN] //
	static login(email, password) {
		let result = new Promise ((resolve, reject) => {
			authAxios.post('/login', { email, password })
				.then(res => { resolve(res) })
				.catch(err => { reject(err) })
		})

		return result
	}

	
	// [REGISTER] //
	static register(first_name, last_name, username, email, password) {
		let result = new Promise ((resolve, reject) => {
			authAxios.post('/register', {
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