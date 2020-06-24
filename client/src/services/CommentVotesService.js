/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT VOTES SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH TOKEN SETUP] //
const token = localStorage.usertoken
const authAxios = axios.create({
	baseURL: '/api/comment-votes',
	headers: {
		authorization: `Bearer ${token}`
	}
})


class CommentVotesService {
	/******************* [CRUD] *******************/
	// [CREATE] Auth Required //
	static async addCommentVote(comment_id, block_id, user_id, email, username) {
		// Add the voter from the Block Object
		let status = await authAxios.post(`/create`, {
			block_id,
			comment_id,
			user_id,
			email,
			username,
		})

		return status
	}


	// [DELETE] Auth Required - User's Single Comment Vote //
	static async removeUsersCommentVote(comment_id, user_id) {
		// Remove the voter from the Block Object
		let status = await authAxios.delete(`/delete/${user_id}/${comment_id}`)

		return status
	}


	// [DELETE ALL] Auth Required - Comment's All User Vote //
	static async removeCommentVotes(comment_id) {
		// Remove the voter from the Block Object
		let status = await authAxios.delete(
			`/delete-all/${comment_id}`
		)

		return status
	}
}


// [EXPORT] //
export default CommentVotesService