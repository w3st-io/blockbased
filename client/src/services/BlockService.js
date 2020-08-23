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
		baseURL: '/api/blocks',
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
		return { status: false, message: `BlockService: Caught Error --> ${e}` }
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
			data.blocks.forEach(block => {
				block.createdAt = new Date(block.createdAt).toLocaleString()
			})
		}

		return data
	}
	catch (e) { return { status: false, error: e } }
}


// [READ] This for Single Block Details //
async function s_read(block_id) {
	const authAxios = await this.authAxios()

	try {
		let { data } = await authAxios.get(`/read/${block_id}`)

		if (data.status) {
			data.block.createdAt = new Date(data.block.createdAt).toLocaleString()
		}

		return data
	}
	catch (e) {
		return { status: false, message: `BlockService: Caught Error --> ${e}` }
	}
}


/******************* [LIKE SYSTEM] *******************/
// ADD/REMOVE LIKE //
async function s_like(block_id) {
	const authAxios = await this.authAxios()

	const { data } = await authAxios.post(`/like/${block_id}`)

	return data
}

async function s_unlike(block_id) {
	const authAxios = await this.authAxios()

	// Remove the liker from the Block Object //
	const { data } = await authAxios.post(`/unlike/${block_id}`)

	return data
}


/******************* [FOLLOW SYSTEM] *******************/
// ADD/REMOVE LIKE //
async function s_follow(block_id) {
	const authAxios = await this.authAxios()

	// Add the liker from the Block Object
	return await authAxios.post(`/follow/${block_id}`)
}

async function s_unfollow(block_id) {
	const authAxios = await this.authAxios()

	// Remove the liker from the Block Object
	return await authAxios.post(`/unfollow/${block_id}`)
}


/******************* [EXISTANCE] *******************/
async function s_existance(block_id) {
	const authAxios = await this.authAxios()

	const { data } = await authAxios.get(`/existance/${block_id}`)
	
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