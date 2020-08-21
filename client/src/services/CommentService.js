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

	const { data } = await authAxios.post(`/create`, {
		block_id,
		text,
	})

	if (data.status) {
		// [EMIT] Notify sockets that comment is created //
		EventBus.$emit('comment-created', data.blockFollowers)
	}

	return data
}


// [READ-ALL] //
async function s_readAll(block_id, amount, pageNumber) {
	const skip = pageNumber * amount
	const authAxios = await this.authAxios()

	try {
		let { data } = await authAxios.get(`/read-all/${block_id}/${amount}/${skip}`)

		if (data.status) {
			data.comments.forEach(comment => {
				comment.createdAt = new Date(comment.createdAt).toLocaleString()
			})
		}

		return data
	}
	catch (e) {
		return { status: false, message: `CommentService: Caught Error --> ${e}` }
	}
}


// [READ] //
async function s_read(comment_id) {
	const authAxios = await this.authAxios()

	try {
		let { data } = await authAxios.get(`/read/${comment_id}`)
	
		if (data.status) {
			data.comment.createdAt = new Date(data.comment.createdAt).toLocaleString()
		}

		return data
	}
	catch (e) {
		return { status: false, message: `CommentService: Caught Error --> ${e}` }
	}
}


// [UPDATE] Auth Required //
async function s_update(comment_id, text) {
	const authAxios = await this.authAxios()

	try {
		const { data } = await authAxios.post(`/update/${comment_id}`,
			{ text }
		)

		return data
	}
	catch (e) {
		return { status: false, message: `CommentService: Caught Error --> ${e}` }
	}
}


// [DELETE] Auth Required //
async function  s_delete(comment_id) {
	const authAxios = await this.authAxios()	

	try {
		const { data } = await authAxios.delete(`/delete/${comment_id}`)

		return data
	}
	catch (e) {
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

	const returned = await authAxios.post(`/report/${comment_id}`,
		{ block_id, reportType }
	)

	return returned
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
}