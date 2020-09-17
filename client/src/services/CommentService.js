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
async function s_create(post_id, text) {
	const authAxios = await this.authAxios()

	const { data } = await authAxios.post(`/create`, {
		post_id,
		text,
	})

	if (data.status) {
		// [EMIT] Notify sockets that comment is created //
		EventBus.$emit('comment-created', data.postFollowers)
	}

	return data
}


// [READ-ALL] //
async function s_readAll(post_id, limit, pageNumber) {
	const skip = pageNumber * limit
	const authAxios = await this.authAxios()

	try {
		let { data } = await authAxios.get(`/read-all/${post_id}/${limit}/${skip}`)

		if (data.status) {
			data.comments.forEach(comment => {
				comment.createdAt = new Date(comment.createdAt).toLocaleString()
			})
		}

		return data
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
	const authAxios = await this.authAxios()

	try {
		let { data } = await authAxios.get(`/read/${comment_id}`)
		
		if (data.status) {
			data.comment.createdAt = new Date(data.comment.createdAt).toLocaleString()
		}

		return data
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
	const authAxios = await this.authAxios()

	try {
		const { data } = await authAxios.post(`/update/${comment_id}`, { text })

		return data
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
	const authAxios = await this.authAxios()	

	try {
		const { data } = await authAxios.delete(`/delete/${comment_id}`)

		return data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `CommentService: Error --> ${err}`
		}
	}
}


/******************* [LIKE SYSTEM] *******************/
// ADD/REMOVE LIKE //
async function s_like(post_id, comment_id) {
	const authAxios = await this.authAxios()

	// Add the liker from the Post Object
	return await authAxios.post(`/like/${comment_id}/${post_id}`)
}
async function  s_unlike(comment_id) {
	const authAxios = await this.authAxios()

	// Remove the liker from the Post Object
	return await authAxios.post(`/unlike/${comment_id}`)
}


/******************* [REPORT] *******************/
async function s_report(post_id, comment_id, reportType) {
	const authAxios = await this.authAxios()

	const returned = await authAxios.post(`/report/${comment_id}`,
		{ post_id, reportType }
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