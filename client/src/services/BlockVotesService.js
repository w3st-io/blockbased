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
	// [CREATE] Auth Required //
	static async createBlockVote(block_id) {
		// Add the voter from the Block Object
		let status = await authAxios.post(`/create`, { block_id })

		return status
	}


	// [DELETE] Auth Required //
	static async deleteBlockVote(block_id) {
		// Remove the voter from the Block Object
		let status = await authAxios.delete(`/delete/${block_id}`)

		return status
	}
}


// [EXPORT] //
export default BlockVotesService