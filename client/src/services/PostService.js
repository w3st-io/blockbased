/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/posts',
		headers: { authorization: `Bearer ${localStorage.usertoken}` }
	})
}


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
async function s_create(cat_id, title, text) {
	const authAxios = await this.authAxios()

	try {
		const { data } = await authAxios.post('/create', { cat_id, title, text })
		
		return data
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `PostService: Error --> ${e}`
		}
	}
}


// [READ-ALL] Within Cat //
async function s_readAll(cat_id, limit, pageNumber, sort) {
	const skip = pageNumber * limit
	const authAxios = await this.authAxios()

	try {
		let { data } = await authAxios.get(
			`/read-all/${cat_id}/${limit}/${skip}/${sort}`
		)
		
		if (data.status) {
			data.posts.forEach(post => {
				post.createdAt = new Date(post.createdAt).toLocaleString()
			})
		}

		return data
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			error: `PostService: Error --> ${e}`
		}
	}
}


// [READ] This for Single Post Details //
async function s_read(post_id) {
	const authAxios = await this.authAxios()

	try {
		let { data } = await authAxios.get(`/read/${post_id}`)

		if (data.status) {
			data.post.createdAt = new Date(data.post.createdAt).toLocaleString()
		}

		return data
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `PostService: Error --> ${e}`
		}
	}
}


/******************* [LIKE SYSTEM] *******************/
// ADD/REMOVE LIKE //
async function s_like(post_id) {
	const authAxios = await this.authAxios()

	const { data } = await authAxios.post(`/like/${post_id}`)

	return data
}

async function s_unlike(post_id) {
	const authAxios = await this.authAxios()

	// Remove the liker from the Post Object //
	const { data } = await authAxios.post(`/unlike/${post_id}`)

	return data
}


/******************* [FOLLOW SYSTEM] *******************/
// ADD/REMOVE LIKE //
async function s_follow(post_id) {
	const authAxios = await this.authAxios()

	// Add the liker from the Post Object
	return await authAxios.post(`/follow/${post_id}`)
}

async function s_unfollow(post_id) {
	const authAxios = await this.authAxios()

	// Remove the liker from the Post Object
	return await authAxios.post(`/unfollow/${post_id}`)
}


/******************* [EXISTANCE] *******************/
async function s_existance(post_id) {
	const authAxios = await this.authAxios()

	const { data } = await authAxios.get(`/existance/${post_id}`)
	
	return data
}


/******************* [COUNT] *******************/
async function s_count(cat_id) {
	const authAxios = await this.authAxios()

	const { data } = await authAxios.get(`/count/${cat_id}`)

	return data
}


// [EXPORT] //
export default {
	authAxios,
	s_create,
	s_readAll,
	s_read,
	s_like,
	s_unlike,
	s_follow,
	s_unfollow,
	s_existance,
	s_count,
}