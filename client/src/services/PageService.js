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
		headers: {
			authorization: `Bearer ${localStorage.usertoken}`,
			authorization2: `Bearer ${localStorage.admintoken}`
		}
	})
}


// [HOME] //
async function s_home() {
	const authAxios = await this.authAxios()

	try {
		const { data } = await authAxios.get('/')

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


// [ADMIN] //
async function s_admin() {
	const authAxios = await this.authAxios()

	try {
		const { data } = await authAxios.get('/admin')

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


// [CAT] //
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


// [POST] //
async function s_post(post_id, limit, pageNumber) {
	const skip = pageNumber * limit
	const authAxios = await this.authAxios()

	try {
		let { data } = await authAxios.get(`/post/${post_id}/${limit}/${skip}`)
			
		if (data.status) {
			// Format Date //
			data.postObj.post.createdAt = new Date(
				data.postObj.post.createdAt
			).toLocaleString()

			data.commentsObj.comments.forEach(comment => {
				comment.createdAt = new Date(comment.createdAt).toLocaleString()
			})
		}
		
		return data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `PageService: Error --> ${err}`
		}
	}
}


// [USER/PROFILE] //
async function s_profile() {
	const authAxios = await this.authAxios()
	
	try {
		const { data } = await authAxios.get('/profile')

		return data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserService: Error --> ${err}`
		}
	}
}


async function s_profile_view(user_id) {
	const authAxios = await this.authAxios()
	
	if (user_id) {
		try {
			const { data } = await authAxios.get(`/profile/view/${user_id}`)

			return data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `UserService: Error --> ${err}`
			}
		}
	}
}


// [EXPORT] //
export default {
	authAxios,
	s_home,
	s_admin,
	s_cat,
	s_post,
	s_profile,
	s_profile_view,
}