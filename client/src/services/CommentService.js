/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'

class CommentService {
	/******************* [COMMENT] *******************/
	// [CREATE] //
	static createComment(block_id, user_id, email, username, comment) {
		return axios.post(`/api/comments/create`, {
			block_id,
			user_id,
			email,
			username,
			comment,
		})	
	}


	// [READ-ALL] //
	static getAllComments(block_id, amountPerPage, pageNumber) {
		// multiply page nubmer with # comments per page to know how much to skip
		let skip = pageNumber * amountPerPage

		let result = new Promise ((resolve, reject) => {
			axios.get(`/api/comments/read-all/${block_id}/${amountPerPage}/${skip}`)
				.then((res) => {
					const data = res.data
					resolve(
						data.map((comment) => ({
							...comment,
						}))
					)
				})
				.catch((err) => { reject(err) })
		})

		return result
	}


	// [READ] //
	static getComment(comment_id) {
		let result = new Promise ((resolve, reject) => {
			axios.get(`/api/comments/read/${comment_id}`)
				.then((res) => { resolve(res.data) })
				.catch((err) => { reject(err) })
		})

		return result
	}


	// [DELETE] //
	static deleteComment(comment_id) {
		let result = new Promise ((resolve, reject) => {
			axios.delete(`/api/comments/delete/${comment_id}`)
				.then((res) => { resolve(res) })
				.catch((err) => { reject(err) })
		})

		return result	
	}


	/******************* [VOTE SYSTEM] *******************/
	// ADD/REMOVE VOTE //
	static async addVote(comment_id, user_id, email, username) {
		// Increment the voteCount //
		await axios.post(`/api/comments/update/increment-vote-count/${comment_id}`)
			
		// Add the voter from the Block Object
		return await axios.post(`/api/comments/update/push-voter/${comment_id}`, {
			user_id,
			email,
			username,
		})
	}
	static async removeVote(block_id, user_id) {
		// Decrement the voteCount //
		await axios.post(`/api/comments/update/decrement-vote-count/${block_id}`)

		// Remove the voter from the Block Object
		return await axios.post(`/api/comments/update/pull-voter/${block_id}`, {
			user_id,
		})
	}
}

// [EXPORT] //
export default CommentService