/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% FOLLOWS SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


class FollowsService {
	// [AUTH TOKEN SETUP] //
	static async authAxios() {
		return axios.create({
			baseURL: '/api/follows',
			headers: {
				authorization: `Bearer ${localStorage.usertoken}`
			}
		})
	}


	/******************* [CRUD] *******************/
	// [CREATE] Auth Required //
	static async createFollow(block_id) {
		const authAxios = await this.authAxios()

		// Add the liker from the Block Object
		let status = await authAxios.post('/create', { block_id })

		return status
	}


	// [DELETE] Auth Required //
	static async deleteFollow(block_id) {
		const authAxios = await this.authAxios()

		// Remove the liker from the Block Object
		let status = await authAxios.delete(`/delete/${block_id}`)

		return status
	}


	/******************* [LIKE SYSTEM] *******************/
	// ADD/REMOVE LIKE //
	static async addFollower(block_id) {
		const authAxios = await this.authAxios()

		let status = await authAxios.post(`/update/push-liker/${block_id}`)

		return status
	}


	static async removeFollower(block_id) {
		const authAxios = await this.authAxios()

		// Remove the liker from the Block Object //
		let status = await authAxios.post(`/update/pull-liker/${block_id}`)

		return status
	}
}


// [EXPORT] //
export default FollowsService