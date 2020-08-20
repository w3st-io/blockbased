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

	try {
		let { data } = await authAxios.get(`/read-all-all/${amount}/${skip}`)

		data.comments.forEach(comment => {
			comment.createdAt = new Date(comment.createdAt).toLocaleString()
		})

		return data
	}
	catch (e) {
		return { status: false, message: `CommentService: Caught Error --> ${e}` }
	}
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
	s_delete,
}