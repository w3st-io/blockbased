/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'

// [IMPORT] Personal //
import { EventBus } from '@main'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/comments',
		headers: { authorization: `Bearer ${localStorage.usertoken}` }
	})
}


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
async function s_create(block_id, text) {
	const authAxios = await this.authAxios()

	const returnedData = await authAxios.post(`/create`, {
		block_id,
		text,
	})

	// [EMIT] Notify sockets that comment is created //
	EventBus.$emit('comment-created', returnedData.data[1])

	return returnedData.data
}


// [READ-ALL] //
async function s_readAll(block_id, amount, pageNumber) {
	const skip = pageNumber * amount
	const authAxios = await this.authAxios()

	try {
		let returnedData = await authAxios.get(`/read-all/${block_id}/${amount}/${skip}`)

		returnedData = returnedData.data.comments.map(comment => ({
			...comment,
			createdAt: new Date(comment.createdAt).toLocaleString(),
		}))

		return { status: true, comments: returnedData }
	}
	catch (e) {
		return { status: false, message: `CommentService: Caught Error --> ${e}` }
	}
}


// [READ] //
async function s_read(comment_id) {
	const authAxios = await this.authAxios()

	try {
		let returnedData = await authAxios.get(`/read/${comment_id}`)
	
		returnedData.data.comment.createdAt = new Date(
			returnedData.data.comment.createdAt
		).toLocaleString()

		return returnedData.data
	}
	catch (e) {
		return { status: false, message: `CommentService: Caught Error --> ${e}` }
	}
}


// [UPDATE] Auth Required //
async function s_update(comment_id, text) {
	const authAxios = await this.authAxios()

	try {
		const returnedData = await authAxios.post(`/update/${comment_id}`,
			{ text }
		)

		return returnedData.data
	}
	catch(e) {
		return { status: false, message: `CommentService: Caught Error --> ${e}` }
	}
}


// [DELETE] Auth Required //
async function  s_delete(comment_id) {
	const authAxios = await this.authAxios()	

	try {
		const returnedData = await authAxios.delete(`/delete/${comment_id}`)

		return returnedData.data
	}
	catch(e) {
		return { status: false, message: `CommentService: Caught Error --> ${e}` }
	}
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

	const returnedData = await authAxios.post(`/report/${comment_id}`,
		{ block_id, reportType }
	)

	return returnedData
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
	s_readAll,
	s_read,
	s_update,
	s_delete,
	s_like,
	s_unlike,
	s_report,
	s_count,
}