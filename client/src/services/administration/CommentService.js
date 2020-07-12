/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION COMMENT SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH TOKEN SETUP] //
const token = localStorage.admintoken
const authAxios = axios.create({
	baseURL: '/api/administration/comments',
	headers: {
		authorization2: `Bearer ${token}`
	}
})


class AdministrationCommentService {
	/******************* [COMMENT] *******************/
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


	// [READ-ALL] Auth Required - Within a Block //
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


	// [UPDATE] //
	static update(comment_id, comment) {
		let result = new Promise ((resolve, reject) => {
			authAxios.post(`/update/${comment_id}`, { comment })
				.then((res) => { resolve(res.data) })
				.catch((err) => { reject(err) })
		})

		return result
	}


	// [DELETE] //
	static delete(comment_id) {
		let result = new Promise ((resolve, reject) => {
			authAxios.delete(`/delete/${comment_id}`)
				.then((res) => { resolve(res) })
				.catch((err) => { reject(err) })
		})

		return result	
	}
}


// [EXPORT] //
export default AdministrationCommentService