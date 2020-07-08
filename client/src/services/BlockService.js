/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH TOKEN SETUP] //
let token = localStorage.usertoken
const authAxios = axios.create({
	baseURL: '/api/blocks',
	headers: {
		authorization: `Bearer ${token}`
	}
})


class BlockService {
	/******************* [CRUD] *******************/
	// [CREATE] Auth Required //
	static async createBlock(title, cat_id) {
		let status = await authAxios.post('/create', { title, cat_id })

		return status
	}


	// [READ ALL] //
	static async getAllBlocks(cat_id, amountPerPage, pageNumber) {
		// multiply page number with # blocks per page to know how much to skip
		let skip = pageNumber * amountPerPage

		let result = new Promise ((resolve, reject) => {
			authAxios.get(`/read-all/${cat_id}/${amountPerPage}/${skip}`)
				.then((res) => {
					resolve(res.data.map((block) => ({
						...block,
						createdAt: new Date(block.createdAt).toLocaleString()
					})))
				})
				.catch((err) => { reject(err) })
		})

		return result
	}


	// [READ] This for Single Block Details //
	static getBlockDetails(block_id) {
		let result = new Promise ((resolve, reject) => {
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
	static deleteBlock(block_id) {
		console.log(block_id)
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
	static async addVote(block_id) {
		let status = await authAxios.post(`/update/push-voter/${block_id}`)

		return status
	}


	static async removeVote(block_id) {
		// Remove the voter from the Block Object //
		let status = await authAxios.post(`/update/pull-voter/${block_id}`)

		return status
	}

	/******************* [VALIDATION] *******************/
	static async validateExistance(block_id) {
		let valid = await authAxios.get(`/validate/${block_id}`)
		
		return valid.data
	}


	/******************* [COUNT] *******************/
	static async countBlocksForCat(cat_id) {
		let count = await authAxios.get(`/count/${cat_id}`)

		return count.data
	}
}


// [EXPORT] //
export default BlockService