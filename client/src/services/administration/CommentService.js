/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
 * %%% ADMINISTRATION COMMENT SERVICES %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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

	try { return (await authAxios.post(`/read-all-all/${page}`, { limit })).data }
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

	try { return (await authAxios.delete(`/delete/${comment_id}`)).data }
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