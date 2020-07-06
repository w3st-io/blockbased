/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% FOLLOWS SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH TOKEN SETUP] //
const token = localStorage.usertoken
const authAxios = axios.create({
	baseURL: '/api/follows',
	headers: {
		authorization: `Bearer ${token}`
	}
})


class FollowsService {
	/******************* [CRUD] *******************/
	// [CREATE] Auth Required //
	static async createFollow(block_id) {
		// Add the voter from the Block Object
		let status = await authAxios.post('/create', { block_id })

		return status
	}


	// [DELETE] Auth Required //
	static async deleteFollow(block_id) {
		// Remove the voter from the Block Object
		let status = await authAxios.delete(`/delete/${block_id}`)

		return status
	}
}


// [EXPORT] //
export default FollowsService