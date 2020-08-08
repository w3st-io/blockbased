/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION COMMENT SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/administration/comments',
		headers: { authorization2: `Bearer ${localStorage.admintoken}` }
	})
}


/******************* [CRUD] *******************/
// [READ-ALL] Auth Required //
async function s_readAllAll(amount, pageNumber) {
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
async function s_readAll(block_id, amount, pageNumber) {
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
async function s_read(comment_id) {
	const authAxios = await this.authAxios()

	const result = new Promise ((resolve, reject) => {
		authAxios.get(`/read/${comment_id}`)
		.then((res) => { resolve(res.data) })
		.catch((err) => { reject(err) })
	})

	return result
}


// [UPDATE] //
async function s_update(comment_id, comment) {
	const authAxios = await this.authAxios()

	const result = new Promise ((resolve, reject) => {
		authAxios.post(`/update/${comment_id}`, { comment })
			.then((res) => { resolve(res.data) })
			.catch((err) => { reject(err) })
	})

	return result
}


// [DELETE] //
async function s_delete(comment_id) {
	const authAxios = await this.authAxios()

	const result = new Promise ((resolve, reject) => {
		authAxios.delete(`/delete/${comment_id}`)
			.then((res) => { resolve(res) })
			.catch((err) => { reject(err) })
	})

	return result	
}


// [EXPORT] //
export default {
	authAxios,
	s_readAllAll,
	s_readAll,
	s_read,
	s_update,
	s_delete,
}