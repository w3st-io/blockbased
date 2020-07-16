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
				authorization: `Bearer ${localStorage.usertoken}`
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
		const authAxios = await this.authAxios()
		const skip = pageNumber * amount

		const result = new Promise ((resolve, reject) => {
			authAxios.get(`/read-all/${cat_id}/${amount}/${skip}`)
				.then((res) => {
					resolve(res.data.map((block) => (
						{
							...block,
							createdAt: new Date(block.createdAt).toLocaleString()
						}
					)))
				})
				.catch((err) => { reject(err) })
		})

		return result
	}


	// [READ] This for Single Block Details //
	static async read(block_id) {
		const authAxios = await this.authAxios()

		const result = new Promise ((resolve, reject) => {
			authAxios.get(`/read/${block_id}`)
				.then((res) => {
					res.data.createdAt = new Date(res.data.createdAt).toLocaleString()
					resolve(res.data)
				})
				.catch((err) => { reject(err) })
		})

		return result
	}


	
	// [DELETE] Auth Required //
	static async deleteBlock(block_id) {
		const authAxios = await this.authAxios()
		
		console.log(block_id)
		console.log(authAxios)
		/*
		let result = new Promise ((resolve, reject) => {
			authAxios.delete(`/blocks/delete/${block_id}`)
				.then((res) => { resolve(res) })
				.catch((err) => { reject(err) })
		})

		return result
		*/
	}


	/******************* [VOTE SYSTEM] *******************/
	// ADD/REMOVE VOTE //
	static async like(block_id) {
		const authAxios = await this.authAxios()

		return await authAxios.post(`/like/${block_id}`)
	}


	static async unlike(block_id) {
		const authAxios = await this.authAxios()

		// Remove the liker from the Block Object //
		return await authAxios.post(`/unlike/${block_id}`)
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