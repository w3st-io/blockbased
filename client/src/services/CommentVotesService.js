/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT VOTES SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'

class CommentVotesService {
	/******************* [CRUD] *******************/

	/******************* [OTHER CRUD] *******************/
	// [UPDATE] Vote System //
	// ADD/REMOVE VOTE //
	static async addCommentVote(comment_id, block_id, user_id, email, username) {
		// Add the voter from the Block Object
		return await axios.post(`/api/comment-votes/create`, {
			block_id,
			comment_id,
			user_id,
			email,
			username,
		})
	}
	static async removeCommentVote(comment_id, user_id) {
		// Remove the voter from the Block Object
		return await axios.delete(
			`/api/comment-votes/delete/${user_id}/${comment_id}`
		)
	}
}


// [EXPORT] //
export default CommentVotesService