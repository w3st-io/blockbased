/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK VOTES SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH TOKEN SETUP] //
const token = localStorage.usertoken
const authAxios = axios.create({
	baseURL: '/api/block-votes',
	headers: {
		authorization: `Bearer ${token}`
	}
})


class BlockVotesService {
	/******************* [CRUD] *******************/
	// [CREATE] ADD VOTE //
	static async addBlockVote(block_id, user_id, email, username) {
		// Add the voter from the Block Object
		let status = await authAxios.post(`/create`, {
			block_id,
			user_id,
			email,
			username,
		})

		return status
	}


	// [DELETE] REMOVE VOTE //
	static async removeBlockVote(block_id, user_id) {
		// Remove the voter from the Block Object
		let status = await authAxios.delete(`/delete/${user_id}/${block_id}`)

		return status
	}
}


// [EXPORT] //
export default BlockVotesService