/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
const authAxios = async () => {
	return axios.create({
		baseURL: '/pages',
		headers: { authorization: `Bearer ${localStorage.usertoken}` }
	})
}


// [READ-ALL] Within Cat //
async function s_cat(cat_id, limit, pageNumber, sort) {
	const skip = pageNumber * limit
	const authAxios = await this.authAxios()

	try {
		let { data } = await authAxios.get(
			`/cat/${cat_id}/${limit}/${skip}/${sort}`
		)

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
			error: `PageService: Error --> ${err}`
		}
	}
}


// [EXPORT] //
export default {
	authAxios,
	s_cat,
}