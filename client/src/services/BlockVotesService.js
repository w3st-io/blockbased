/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK VOTES SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'

class BlockVotesService {
	/******************* [CRUD] *******************/

	/******************* [OTHER CRUD] *******************/
	// [UPDATE] Vote System //
	// ADD/REMOVE VOTE //
	static async addBlockVote(block_id, user_id, email, username) {
		// Add the voter from the Block Object
		return await axios.post(`/api/block-votes/create`, {
			block_id,
			user_id,
			email,
			username,
		})
	}
	static async removeBlockVote(block_id, user_id) {
		// Remove the voter from the Block Object
		return await axios.delete(
			`/api/block-votes/delete/${user_id}/${block_id}`
		)
	}
}


// [EXPORT] //
export default BlockVotesService