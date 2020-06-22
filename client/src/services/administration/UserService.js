/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION USER SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'

class AdministrationUserService {
	/******************* [USER PROFILE] *******************/
	// [READ-ALL] //
	static async getAllUsersProfileData() {
		let profileData = await axios.get(`/api/administration/users/read/profile-data`)

		return profileData.data
	}

	// [READ] //
	static async getUserProfileData(user_id) {
		let profileData = await axios.get(`/api/administration/users/read/profile-data/${user_id}`)

		return profileData.data
	}

	// [UPDATE] //
	static async updateUserProfileData(user_id, url) {
		return await axios.post(`/api/administration/users/update/profile-data/${user_id}`,
			{ url }
		)
	}
}

// [EXPORT] //
export default AdministrationUserService