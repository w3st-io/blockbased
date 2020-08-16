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

	return await authAxios.post('/create', { cat_id, title, text })
}


// [READ-ALL] //
async function s_readAll(cat_id, amount, pageNumber) {
	const skip = pageNumber * amount
	const authAxios = await this.authAxios()

	try {
		let res = await authAxios.get(`/read-all/${cat_id}/${amount}/${skip}`)

		const blocks = res.data.map(block => ({
			...block,
			createdAt: new Date(block.createdAt).toLocaleString()
		}))

		return blocks
	}
	catch (e) {console.log(e); return { status: false, error: e } }
}


// [READ] This for Single Block Details //
async function s_read(block_id) {
	const authAxios = await this.authAxios()

	try {
		let res = await authAxios.get(`/read/${block_id}`)

		res.data.createdAt = new Date(res.data.createdAt).toLocaleString()

		return res.data
	}
	catch(e) { return e }
}



// [DELETE] Auth Required //
async function s_delete(block_id) {
	const authAxios = await this.authAxios()
	console.log(block_id, authAxios)
	
	/*
	try { return await authAxios.delete(`/blocks/delete/${block_id}`) }
	catch(e) { return e }
	*/
}


/******************* [LIKE SYSTEM] *******************/
// ADD/REMOVE LIKE //
async function s_like(block_id) {
	const authAxios = await this.authAxios()

	return await authAxios.post(`/like/${block_id}`)
}

async function s_unlike(block_id) {
	const authAxios = await this.authAxios()

	// Remove the liker from the Block Object //
	return await authAxios.post(`/unlike/${block_id}`)
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


/******************* [VALIDATION] *******************/
async function s_validateExistance(block_id) {
	const authAxios = await this.authAxios()

	let valid = await authAxios.get(`/existance/${block_id}`)
	
	return valid.data
}


/******************* [COUNT] *******************/
async function s_countWithinCat(cat_id) {
	const authAxios = await this.authAxios()

	let count = await authAxios.get(`/count/${cat_id}`)

	return count.data
}


// [EXPORT] //
export default {
	authAxios,
	s_create,
	s_readAll,
	s_read,
	s_delete,
	s_like,
	s_unlike,
	s_follow,
	s_unfollow,
	s_validateExistance,
	s_countWithinCat,
}