/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/comments',
		headers: {
			authorization: `Bearer ${localStorage.usertoken}`
		}
	})
}


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
async function s_create(block_id, blockFollowers, text) {
	const authAxios = await this.authAxios()

	return await authAxios.post(`/create`, { block_id, blockFollowers, text })
}


// [READ-ALL] Auth Required //
async function s_readAllAll(amount, pageNumber) {
	const skip = pageNumber * amount
	const authAxios = await this.authAxios()

	try {
		let res = await authAxios.get(`/read-all-all/${amount}/${skip}`)

		const comments = res.data.map((comment) => ({
			...comment,
			createdAt: new Date(comment.createdAt).toLocaleString(),
		}))

		return comments
	}
	catch (e) { return e }
}


// [READ-ALL] //
async function s_readAll(block_id, amount, pageNumber) {
	const skip = pageNumber * amount
	const authAxios = await this.authAxios()

	try {
		let res = await authAxios.get(`/read-all/${block_id}/${amount}/${skip}`)

		const comments = res.data.map((comment) => ({
			...comment,
			createdAt: new Date(comment.createdAt).toLocaleString(),
		}))

		return comments
	}
	catch (e) { return e }
}


// [READ] //
async function s_read(comment_id) {
	const authAxios = await this.authAxios()

	try {
		let res = await authAxios.get(`/read/${comment_id}`)
	
		res.data.createdAt = new Date(res.data.createdAt).toLocaleString()

		return res.data
	}
	catch (e) { return e }
}


// [UPDATE] Auth Required //
async function s_update(comment_id, text) {
	const authAxios = await this.authAxios()

	try { return await authAxios.post(`/update/${comment_id}`, { text }) }
	catch(e) { return e }
}


// [DELETE] Auth Required //
async function  s_delete(comment_id) {
	const authAxios = await this.authAxios()	

	try { return await authAxios.delete(`/delete/${comment_id}`) }
	catch(e) { return e }
}


/******************* [LIKE SYSTEM] *******************/
// ADD/REMOVE LIKE //
async function s_like(block_id, comment_id) {
	const authAxios = await this.authAxios()

	// Add the liker from the Block Object
	return await authAxios.post(`/like/${comment_id}/${block_id}`)
}
async function  s_unlike(comment_id) {
	const authAxios = await this.authAxios()

	// Remove the liker from the Block Object
	return await authAxios.post(`/unlike/${comment_id}`)
}


/******************* [REPORT] *******************/
async function s_report(block_id, comment_id, reportType) {
	const authAxios = await this.authAxios()

	const status = await authAxios.post(
		`/report/${comment_id}`,
		{ block_id, reportType }
	)

	return status
}


/******************* [COUNT] *******************/
async function s_count(block_id) {
	const authAxios = await this.authAxios()

	const count = await authAxios.get(`/count/${block_id}`)

	return count.data
}


// [EXPORT] //
export default {
	authAxios,
	s_create,
	s_readAllAll,
	s_readAll,
	s_read,
	s_update,
	s_delete,
	s_like,
	s_unlike,
	s_report,
	s_count,
}