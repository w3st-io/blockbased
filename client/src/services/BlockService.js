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
		const returned = await authAxios.post('/create', { cat_id, title, text })
		return returned.data
	}
	catch (e) {
		return { status: false, message: `BlockService: Caught Error --> ${e}` }
	}
}


// [READ-ALL] Within Cat //
async function s_readAll(cat_id, amount, pageNumber) {
	const skip = pageNumber * amount
	const authAxios = await this.authAxios()

	try {
		const returned = await authAxios.get(`/read-all/${cat_id}/${amount}/${skip}`)
		
		console.log(returned)

		const blocks = returned.data.blocks.map(block => ({
			...block,
			createdAt: new Date(block.createdAt).toLocaleString()
		}))

		return blocks
	}
	catch (e) { return { status: false, error: e } }
}


// [READ] This for Single Block Details //
async function s_read(block_id) {
	const authAxios = await this.authAxios()

	try {
		let returned = await authAxios.get(`/read/${block_id}`)

		returned.data.block.createdAt = new Date(
			returned.data.block.createdAt
		).toLocaleString()

		return returned.data.block
	}
	catch (e) {
		console.log(`BlockService: Caught Error --> ${e}`)

		return { status: false, message: `BlockService: Caught Error --> ${e}` }
	}
}


/******************* [LIKE SYSTEM] *******************/
// ADD/REMOVE LIKE //
async function s_like(block_id) {
	const authAxios = await this.authAxios()

	const returned = await authAxios.post(`/like/${block_id}`)

	return returned.data
}

async function s_unlike(block_id) {
	const authAxios = await this.authAxios()

	// Remove the liker from the Block Object //
	const returned = await authAxios.post(`/unlike/${block_id}`)

	return returned.data
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

	const returned = await authAxios.get(`/existance/${block_id}`)
	
	return returned.data
}


/******************* [COUNT] *******************/
async function s_count(cat_id) {
	const authAxios = await this.authAxios()

	const returned = await authAxios.get(`/count/${cat_id}`)

	return returned.data
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