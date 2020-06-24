/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH TOKEN SETUP] //
const token = localStorage.usertoken
const authAxios = axios.create({
	baseURL: '/api/comments',
	headers: {
		authorization: `Bearer ${token}`
	}
})


class CommentService {
	/******************* [COMMENT] *******************/
	// [CREATE] //
	static createComment(block_id, user_id, email, username, comment) {
		let status = authAxios.post(`/create`, {
			block_id,
			user_id,
			email,
			username,
			comment,
		})

		return status
	}


	// [READ-ALL] //
	static getAllComments(block_id, amountPerPage, pageNumber) {
		// * page number with # comments per page to calc. skip

		let skip = pageNumber * amountPerPage

		let result = new Promise ((resolve, reject) => {
			authAxios.get(`/read-all/${block_id}/${amountPerPage}/${skip}`)
				.then((res) => {
					const data = res.data
					resolve(
						data.map((comment) => ({ ...comment }))
					)
				})
				.catch((err) => { reject(err) })
		})

		return result
	}


	// [READ] //
	static getComment(comment_id) {
		let result = new Promise ((resolve, reject) => {
			authAxios.get(`/read/${comment_id}`)
				.then((res) => { resolve(res.data) })
				.catch((err) => { reject(err) })
		})

		return result
	}


	// [UPDATE] //
	static updateComment(comment_id, comment) {
		let result = new Promise ((resolve, reject) => {
			authAxios.post(`/update/${comment_id}`, { comment })
				.then((res) => { resolve(res.data) })
				.catch((err) => { reject(err) })
		})

		return result
	}


	// [DELETE] //
	static deleteComment(comment_id) {
		let result = new Promise ((resolve, reject) => {
			authAxios.delete(`/delete/${comment_id}`)
				.then((res) => { resolve(res) })
				.catch((err) => { reject(err) })
		})

		return result	
	}


	/******************* [VOTE SYSTEM] *******************/
	// ADD/REMOVE VOTE //
	static async addVote(comment_id, user_id, email, username) {
		// Add the voter from the Block Object
		let status = await authAxios.post(`/update/push-voter/${comment_id}`, {
			user_id,
			email,
			username,
		})

		return status
	}
	static async removeVote(block_id, user_id) {
		// Remove the voter from the Block Object
		let status = await authAxios.post(`/update/pull-voter/${block_id}`, {
			user_id,
		})

		return status
	}
}


// [EXPORT] //
export default CommentService