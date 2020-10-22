/**
 * %%%%%%%%%%%%%%%%%%%%%%
 * %%% BLOCK SERVICES %%%
 * %%%%%%%%%%%%%%%%%%%%%%
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
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `PostService: Error --> ${err}`
		}
	}
}


// [READ] Single Post //
async function s_read(post_id) {
	const authAxios = await this.authAxios()

	try {
		const { data } = await authAxios.get(`/read/${post_id}`)

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


/******************* [OTHER-CRUD] *******************/
// [READ-ALL] Within Cat //
async function s_readAllSort(cat_id, limit, page, sort) {
	const authAxios = await this.authAxios()

	try {
		const { data } = await authAxios.post(
			`/read-all-sort/${cat_id}/${page}`,
			{ limit, sort }
		)

		return data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			error: `PostService: Error --> ${err}`
		}
	}
}


/******************* [LIKE-SYSTEM] *******************/
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
	s_read,
	s_readAllSort,
	s_like,
	s_unlike,
	s_follow,
	s_unfollow,
	s_count,
}