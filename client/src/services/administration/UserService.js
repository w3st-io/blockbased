/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION USER SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH TOKEN SETUP] //
const token = localStorage.admintoken
const authAxios = axios.create({
	baseURL: '/api/administration/users',
	headers: {
		authorization2: `Bearer ${token}`
	}
})


class AdministrationUserService {
	/******************* [USER PROFILE] *******************/
	// [READ-ALL] //
	static async getAllUsersProfileData() {
		let profileData = await authAxios.get(`/read-all/profile-data`)

		return profileData.data
	}

	// [READ] //
	static async getUserProfileData(user_id) {
		let profileData = await authAxios.get(`/read/profile-data/${user_id}`)

		return profileData.data
	}

	// [UPDATE] //
	static async updateUserProfileData(user_id, url) {
		return await authAxios.post(`/update/profile-data/${user_id}`,
			{ url }
		)
	}
}

// [EXPORT] //
export default AdministrationUserService