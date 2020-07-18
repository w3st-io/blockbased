/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


class CommentService {
	// [AUTH TOKEN SETUP] //
	static async authAxios() {
		return axios.create({
			baseURL: '/api/comments',
			headers: {
				authorization: `Bearer ${localStorage.usertoken}`
			}
		})
	}

	
	/******************* [CRUD] *******************/
	// [CREATE] Auth Required //
	static async create(block_id, text) {
		const authAxios = await this.authAxios()

		return await authAxios.post(`/create`, { block_id, text })
	}


	// [READ-ALL] Auth Required //
	static async readAllAll(amount, pageNumber) {
		const authAxios = await this.authAxios()
		const skip = pageNumber * amount

		const result = new Promise ((resolve, reject) => {
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
	static async readAll(block_id, amount, pageNumber) {
		const authAxios = await this.authAxios()
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
	static async read(comment_id) {
		const authAxios = await this.authAxios()

		const result = new Promise ((resolve, reject) => {
			authAxios.get(`/read/${comment_id}`)
				.then((res) => { resolve(res.data) })
				.catch((err) => { reject(err) })
		})

		return result
	}


	// [UPDATE] Auth Required //
	static async update(comment_id, text) {
		const authAxios = await this.authAxios()

		const result = new Promise ((resolve, reject) => {
			authAxios.post(`/update/${comment_id}`, { text })
				.then((res) => { resolve(res.data) })
				.catch((err) => { reject(err) })
		})

		return result
	}


	// [DELETE] Auth Required //
	static async delete(comment_id) {
		const authAxios = await this.authAxios()
		
		const result = new Promise ((resolve, reject) => {
			authAxios.delete(`/delete/${comment_id}`)
				.then((res) => { resolve(res) })
				.catch((err) => { reject(err) })
		})

		return result	
	}


	/******************* [LIKE SYSTEM] *******************/
	// ADD/REMOVE LIKE //
	static async like(block_id, comment_id) {
		const authAxios = await this.authAxios()

		// Add the liker from the Block Object
		return await authAxios.post(`/like/${comment_id}/${block_id}`)
	}
	static async unlike(comment_id) {
		const authAxios = await this.authAxios()

		// Remove the liker from the Block Object
		return await authAxios.post(`/unlike/${comment_id}`)
	}


	/******************* [REPORT] *******************/
	static async report(block_id, comment_id, reportType) {
		const authAxios = await this.authAxios()

		const status = await authAxios.post(
			`/report/${comment_id}`,
			{ block_id, reportType }
		)

		return status
	}


	/******************* [COUNT] *******************/
	static async count(block_id) {
		const authAxios = await this.authAxios()

		const count = await authAxios.get(`/count/${block_id}`)

		return count.data
	}
}


// [EXPORT] //
export default CommentService