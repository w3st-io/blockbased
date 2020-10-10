/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION BLOCK SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/administration/posts',
		headers: {
			authorization: `Bearer ${localStorage.usertoken}`,
			authorization2: `Bearer ${localStorage.admintoken}`
		}
	})
}


/******************* [CRUD] *******************/
// [READ-ALL-ALL] Auth Required //
async function s_readAllAll(limit, page) {
	const authAxios = await this.authAxios()

	try {
		let { data } = await authAxios.get(`/read-all-all/${limit}/${page}`)
		
		if (data.status) {
			data.posts.forEach(post => {
				post.createdAt = new Date(post.createdAt).toLocaleString()
			})
		}

		return data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `PostService: Error --> ${err}`
		}
	}
}

// [DELETE] Auth Required //
async function s_delete(post_id) {
	const authAxios = await this.authAxios()

	const result = new Promise ((resolve, reject) => {
		authAxios.delete(`/delete/${post_id}`)
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