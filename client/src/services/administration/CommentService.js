/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION COMMENT SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


class AdministrationCommentService {
	// [AUTH-TOKEN-SETUP] //
	static async authAxios() {
		return axios.create({
			baseURL: '/api/administration/comments',
			headers: {
				authorization2: `Bearer ${localStorage.admintoken}`,
			}
		})
	}


	/******************* [COMMENT] *******************/
	// [READ-ALL] Auth Required //
	static async readAllAll(amount, pageNumber) {
		const authAxios = await this.authAxios()
		const skip = pageNumber * amount

		const result = new Promise ((resolve, reject) => {
			authAxios.get(`/read-all-all/${amount}/${skip}`)
				.then((res) => {
					const returnedData = res.data

					resolve(
						returnedData.map((comment) => ({
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


	// [UPDATE] //
	static async update(comment_id, comment) {
		const authAxios = await this.authAxios()

		const result = new Promise ((resolve, reject) => {
			authAxios.post(`/update/${comment_id}`, { comment })
				.then((res) => { resolve(res.data) })
				.catch((err) => { reject(err) })
		})

		return result
	}


	// [DELETE] //
	static async delete(comment_id) {
		const authAxios = await this.authAxios()

		const result = new Promise ((resolve, reject) => {
			authAxios.delete(`/delete/${comment_id}`)
				.then((res) => { resolve(res) })
				.catch((err) => { reject(err) })
		})

		return result	
	}
}


// [EXPORT] //
export default AdministrationCommentService