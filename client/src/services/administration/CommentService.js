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
		headers: {
			authorization: `Bearer ${localStorage.usertoken}`,
			authorization2: `Bearer ${localStorage.admintoken}`
		}
	})
}


/******************* [CRUD] *******************/
// [READ-ALL] Auth Required //
async function s_readAllAll(limit, page) {
	const authAxios = await this.authAxios()

	try {
		let { data } = await authAxios.get(`/read-all-all/${limit}/${page}`)

		data.comments.forEach(comment => {
			comment.createdAt = new Date(comment.createdAt).toLocaleString()
		})

		return data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `ACommentService: Error --> ${err}` }
	}
}


// [DELETE] //
async function s_delete(comment_id) {
	const authAxios = await this.authAxios()

	try {
		const { data } = await authAxios.delete(`/delete/${comment_id}`)

		return data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `ACommentService: Error --> ${err}`
		}
	}
}


// [EXPORT] //
export default {
	authAxios,
	s_readAllAll,
	s_delete,
}