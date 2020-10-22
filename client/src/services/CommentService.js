/**
 * %%%%%%%%%%%%%%%%%%%%%%%%
 * %%% COMMENT SERVICES %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/comments',
		headers: { authorization: `Bearer ${localStorage.usertoken}` }
	})
}


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
async function s_create(post_id, text, replyToComment = null) {
	try {
		const authAxios = await this.authAxios()
		
		return (
			await authAxios.post(`/create`, { post_id, text, replyToComment })
		).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `CommentService: Error --> ${err}`
		}
	}
}


// [READ-ALL] //
async function s_readAll(post_id, limit, page) {
	try {
		const authAxios = await this.authAxios()
		
		return (await authAxios.post(`/read-all/${post_id}/${page}`, { limit })).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `CommentService: Error --> ${err}`
		}
	}
}


// [READ] //
async function s_read(comment_id) {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.get(`/read/${comment_id}`)).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `CommentService: Error --> ${err}`
		}
	}
}


// [UPDATE] Auth Required //
async function s_update(comment_id, text) {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.post(`/update/${comment_id}`, { text })).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `CommentService: Error --> ${err}`
		}
	}
}


// [DELETE] Auth Required //
async function  s_delete(comment_id) {
	try {
		const authAxios = await this.authAxios()	

		return (await authAxios.delete(`/delete/${comment_id}`)).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `CommentService: Error --> ${err}`
		}
	}
}


/******************* [LIKE-SYSTEM] *******************/
// ADD/REMOVE LIKE //
async function s_like(post_id, comment_id) {
	try {
		const authAxios = await this.authAxios()

		// Add the liker from the Post Object
		return await authAxios.post(`/like/${comment_id}/${post_id}`)
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `CommentService: Error --> ${err}`
		}
	}
}


async function  s_unlike(comment_id) {
	try {
		const authAxios = await this.authAxios()

		// Remove the liker from the Post Object
		return await authAxios.post(`/unlike/${comment_id}`)
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `CommentService: Error --> ${err}`
		}
	}
}


/******************* [REPORT] *******************/
async function s_report(post_id, comment_id, reportType) {
	try {
		const authAxios = await this.authAxios()

		return await authAxios.post(`/report/${comment_id}`, { post_id, reportType })
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `CommentService: Error --> ${err}`
		}
	}
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