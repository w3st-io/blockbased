/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'

class BlockService {
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
	static async removeVote(block_id, user_id) {
		// Remove the voter from the Block Object
		return await axios.post(`/api/blocks/delete`, {
			block_id,
			user_id,
		})
	}
}


// [EXPORT] //
export default BlockService