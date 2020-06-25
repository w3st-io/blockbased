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
	// [READ-ALL] Auth Required //
	static async getAllUsersProfileData() {
		let profileData = await authAxios.get(`/read-all/profile-data`)

		return profileData.data
	}

	// [READ] Auth Required //
	static async getUserProfileData(user_id) {
		let profileData = await authAxios.get(`/read/profile-data/${user_id}`)

		return profileData.data
	}

	// [UPDATE] Auth Required //
	static async updateUserProfileData(user_id, img_url) {
		return await authAxios.post(`/update/profile-data/${user_id}`,
			{ img_url }
		)
	}
}

// [EXPORT] //
export default AdministrationUserService