/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION USER SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


class AdministrationUserService {
	// [AUTH-TOKEN-SETUP] //
	static async authAxios() {
		return axios.create({
			baseURL: '/api/administration/users',
			headers: {
				authorization2: `Bearer ${localStorage.admintoken}`,
			}
		})
	}

	/******************* [USER PROFILE] *******************/
	// [READ-ALL] Auth Required //
	static async getAllUsersProfileData() {
		const authAxios = await this.authAxios()

		try {
			const returnedData = await authAxios.get(`/read-all/profile-data`)

			return {
				status: true,
				users: returnedData.data,
			}
		}
		catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
	}

	// [READ] Auth Required //
	static async getUserProfileData(user_id) {
		const authAxios = await this.authAxios()

		try {
			const returnedData = await authAxios.get(`/read/${user_id}`)

			return {
				status: true,
				users: returnedData.data,
			}
		}
		catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
	}

	// [UPDATE] Auth Required //
	static async updateUserProfileData(user_id, img_url) {
		const authAxios = await this.authAxios()

		return await authAxios.post(`/update/${user_id}`,
			{ img_url }
		)
	}
}

// [EXPORT] //
export default AdministrationUserService