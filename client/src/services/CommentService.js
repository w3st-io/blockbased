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
	/******************* [CRRUD] *******************/
	// [CREATE] Auth Required //
	static create(block_id, comment) {
		let status = authAxios.post(`/create`, { block_id, comment })

		return status
	}


	// [READ-ALL] Auth Required //
	static readAllAll(amount, pageNumber) {
		// * page number with # comments per page to calc. skip

		let skip = pageNumber * amount

		let result = new Promise ((resolve, reject) => {
			authAxios.get(`/read-all-all/${amount}/${skip}`)
				.then((res) => {
					resolve(
						res.data.map((comment) => ({
							...comment,
							createdAt: new Date(comment.createdAt).toLocaleString(),
						}))
					)
				})
				.catch((err) => { reject(err) })
		})

		return result
	}


	// [READ-ALL] //
	static readAll(block_id, amount, pageNumber) {
		const skip = pageNumber * amount

		const result = new Promise ((resolve, reject) => {
			authAxios.get(`/read-all/${block_id}/${amount}/${skip}`)
				.then((res) => {
					const data = res.data
					resolve(data.map((comment) => ({
						...comment,
						createdAt: new Date(comment.createdAt).toLocaleString()
					})))
				})
				.catch((err) => { reject(err) })
		})

		return result
	}


	// [READ] //
	static read(comment_id) {
		let result = new Promise ((resolve, reject) => {
			authAxios.get(`/read/${comment_id}`)
				.then((res) => { resolve(res.data) })
				.catch((err) => { reject(err) })
		})

		return result
	}


	// [UPDATE] Auth Required //
	static update(comment_id, comment) {
		let result = new Promise ((resolve, reject) => {
			authAxios.post(`/update/${comment_id}`, { comment })
				.then((res) => { resolve(res.data) })
				.catch((err) => { reject(err) })
		})

		return result
	}


	// [DELETE] Auth Required //
	static delete(comment_id) {
		let result = new Promise ((resolve, reject) => {
			authAxios.delete(`/delete/${comment_id}`)
				.then((res) => { resolve(res) })
				.catch((err) => { reject(err) })
		})

		return result	
	}


	/******************* [VOTE SYSTEM] *******************/
	// ADD/REMOVE VOTE //
	static async vote(block_id, comment_id) {
		// Add the voter from the Block Object
		let status = await authAxios.post(`/vote/${comment_id}/${block_id}`)

		return status
	}
	static async unvote(comment_id) {
		// Remove the voter from the Block Object
		let status = await authAxios.post(`/unvote/${comment_id}`)

		return status
	}


	/******************* [REPORT] *******************/
	static async report(block_id, comment_id, reportType) {
		let status = await authAxios.post(
			`/report/${comment_id}`,
			{ block_id, reportType }
		)

		return status
	}


	/******************* [COUNT] *******************/
	static async count(block_id) {
		let count = await authAxios.get(`/count/${block_id}`)

		return count.data
	}
}


// [EXPORT] //
export default CommentService