/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


class BlockService {
	// [AUTH TOKEN SETUP] //
	static async authAxios() {
		return axios.create({
			baseURL: '/api/blocks',
			headers: {
				authorization: `Bearer ${localStorage.usertoken}`,
			}
		})
	}


	/******************* [CRUD] *******************/
	// [CREATE] Auth Required //
	static async create(title, cat_id) {
		const authAxios = await this.authAxios()

		return await authAxios.post('/create', { title, cat_id })
	}


	// [READ-ALL] //
	static async readAll(cat_id, amount, pageNumber) {
		const skip = pageNumber * amount
		const authAxios = await this.authAxios()

		try {
			let res = await authAxios.get(`/read-all/${cat_id}/${amount}/${skip}`)

			const blocks = res.data.map((block) => ({
				...block,
				createdAt: new Date(block.createdAt).toLocaleString()
			}))

			return blocks
		}
		catch (e) {console.log(e); return { status: false, error: e } }
	}


	// [READ] This for Single Block Details //
	static async read(block_id) {
		const authAxios = await this.authAxios()

		try {
			let res = await authAxios.get(`/read/${block_id}`)

			res.data.createdAt = new Date(res.data.createdAt).toLocaleString()

			return res.data
		}
		catch(e) { return e }
	}


	
	// [DELETE] Auth Required //
	static async deleteBlock(block_id) {
		const authAxios = await this.authAxios()
		console.log(block_id)
		console.log(authAxios)
		
		/*
		try { return await authAxios.delete(`/blocks/delete/${block_id}`) }
		catch(e) { return e }
		*/
	}


	/******************* [LIKE SYSTEM] *******************/
	// ADD/REMOVE LIKE //
	static async like(block_id) {
		const authAxios = await this.authAxios()

		return await authAxios.post(`/like/${block_id}`)
	}


	static async unlike(block_id) {
		const authAxios = await this.authAxios()

		// Remove the liker from the Block Object //
		return await authAxios.post(`/unlike/${block_id}`)
	}


	/******************* [FOLLOW SYSTEM] *******************/
	// ADD/REMOVE LIKE //
	static async follow(block_id) {
		const authAxios = await this.authAxios()

		// Add the liker from the Block Object
		return await authAxios.post(`/follow/${block_id}`)
	}
	static async unfollow(block_id) {
		const authAxios = await this.authAxios()

		// Remove the liker from the Block Object
		return await authAxios.post(`/unfollow/${block_id}`)
	}


	/******************* [VALIDATION] *******************/
	static async validateExistance(block_id) {
		const authAxios = await this.authAxios()

		let valid = await authAxios.get(`/existance/${block_id}`)
		
		return valid.data
	}


	/******************* [COUNT] *******************/
	static async countWithinCat(cat_id) {
		const authAxios = await this.authAxios()

		let count = await authAxios.get(`/count/${cat_id}`)

		return count.data
	}
}


// [EXPORT] //
export default BlockService