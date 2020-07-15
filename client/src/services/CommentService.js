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
	/******************* [CRUD] *******************/
	// [CREATE] Auth Required //
	static create(block_id, text) {
		const status = authAxios.post(`/create`, { block_id, text })

		return status
	}


	// [READ-ALL] Auth Required //
	static readAllAll(amount, pageNumber) {
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
	static update(comment_id, text) {
		let result = new Promise ((resolve, reject) => {
			authAxios.post(`/update/${comment_id}`, { text })
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
	static async like(block_id, comment_id) {
		// Add the liker from the Block Object
		let status = await authAxios.post(`/like/${comment_id}/${block_id}`)

		return status
	}
	static async unlike(comment_id) {
		// Remove the liker from the Block Object
		let status = await authAxios.post(`/unlike/${comment_id}`)

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