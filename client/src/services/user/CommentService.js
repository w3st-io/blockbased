// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/user/comments',
		headers: {
			user_authorization: `Bearer ${localStorage.usertoken}`,
			admin_authorization: `Bearer ${localStorage.admintoken}`
		}
	})
}


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
async function s_create(post_id, cleanJSON, replyToComment_id = null) {
	try {
		const authAxios = await this.authAxios()
		
		return (
			await authAxios.post(
				'/create',
				{ post_id, cleanJSON, replyToComment_id }
			)
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


// [UPDATE] Auth Required //
async function s_update(comment_id, cleanJSON) {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.post('/update', { comment_id, cleanJSON })).data
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
async function s_delete(comment_id) {
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
async function s_like(post_id, comment_id, commentUser_id) {
	try {
		const authAxios = await this.authAxios()

		// Add the liker from the Post Object
		return (
			await authAxios.post('/like', { post_id, comment_id, commentUser_id })
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


async function s_unlike(comment_id) {
	try {
		const authAxios = await this.authAxios()

		// Remove the liker from the Post Object
		return (await authAxios.post('/unlike', { comment_id })).data
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

		return (
			await authAxios.post('/report', { post_id, comment_id, reportType })
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


// [EXPORT] //
export default {
	authAxios,
	s_create,
	s_update,
	s_delete,
	s_like,
	s_unlike,
	s_report,
}