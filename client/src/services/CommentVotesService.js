/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT VOTES SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'

class CommentVotesService {
	/******************* [CRUD] *******************/

	/******************* [VOTE SYSTEM] *******************/
	// [CREATE] //
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

	// [DELETE] User's Single Comment Vote //
	static async removeUsersCommentVote(comment_id, user_id) {
		// Remove the voter from the Block Object
		return await axios.delete(
			`/api/comment-votes/delete/${user_id}/${comment_id}`
		)
	}

	// [DELETE ALL] Comment's All User Vote //
	static async removeCommentVotes(comment_id) {
		// Remove the voter from the Block Object
		return await axios.delete(
			`/api/comment-votes/delete-all/${comment_id}`
		)
	}
}


// [EXPORT] //
export default CommentVotesService