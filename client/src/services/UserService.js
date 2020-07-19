/**
 * %%%%%%%%%%%%%%%%%%%%% *
 * %%% USER SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import jwtDecode from 'jwt-decode'
import axios from 'axios'


class UserService {
	// [AUTH TOKEN SETUP] //
	static async authAxios() {
		return axios.create({
			baseURL: '/api/users',
			headers: {
				authorization: `Bearer ${localStorage.usertoken}`
			}
		})
	}


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
		const authAxios = await this.authAxios()

		const profileData = await authAxios.get(`/read`)

		return profileData.data
	}


	// [UPDATE] //
	static async updateUserProfileData(img_url) {
		const authAxios = await this.authAxios()

		return await authAxios.post(`/update`, { img_url })
	}

	
	/******************* [USER LOGIN/REGISTER] *******************/
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
			let r = await authAxios.post('/register', {
				first_name,
				last_name,
				username,
				email,
				password,
			})

			console.log('rr',r)

			return r
		}
		catch (e) {
			console.log(`Caught Error --> ${e}`)
			return e	
		}
	}
}


// [EXPORT] //
export default UserService