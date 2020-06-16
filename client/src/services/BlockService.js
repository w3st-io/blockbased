/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'

class BlockService {
	/******************* [CRUD] *******************/
	// [CREATE] //
	static createBlock(user_id, email, username, title, cat_id) {
		return axios.post('/api/blocks/create', {
			user_id,
			email,
			username,
			title,
			cat_id
		})
	}

	// [READ ALL] //
	static getAllBlocks(cat_id, amountPerPage, pageNumber) {
		// multiply page nubmer with # blocks per page to know how much to skip
		let skip = pageNumber * amountPerPage

		let result = new Promise ((resolve, reject) => {
			axios
				.get(`/api/blocks/read-all/${cat_id}/${amountPerPage}/${skip}`)
				.then((res) => {
					const data = res.data
					resolve(
						data.map((block) => ({
							...block,
							createdAt: new Date(block.createdAt)
						}))
					)
				})
				.catch((err) => { reject(err) })
		})

		return result
	}

	// [READ] //
	static getBlockDetails(block_id) {
		let result = new Promise ((resolve, reject) => {
			return axios.get(`/api/blocks/read/${block_id}`)
				.then((res) => {
					const data = res.data
					console.log('RETURNED:', data)

					data.createdAt = new Date(data.createdAt)
					resolve(data)
				})
				.catch((err) => { reject(err) })
		})

		return result
	}


	/* NOT PROGRAMMED YET
	static deleteBlock(id) {
		return axios.delete(`/api/cats/delete/${id}`)
	}
	*/


	/******************* [OTHER CRUD] *******************/
	// [UPDATE] Vote System //
	// ADD/REMOVE VOTE //
	static async addVote(block_id, user_id, email, username) {
		// Increment the voteCount //
		await axios.post(`/api/blocks/update/increment-vote-count/${block_id}`)
			
		// Add the voter from the Block Object
		return await axios.post(`/api/blocks/update/push-voter/${block_id}`, {
			user_id,
			email,
			username,
		})
	}
	static async removeVote(block_id, user_id) {
		// Decrement the voteCount //
		await axios.post(`/api/blocks/update/decrement-vote-count/${block_id}`)

		// Remove the voter from the Block Object
		return await axios.post(`/api/blocks/update/pull-voter/${block_id}`, {
			user_id,
		})
	}
}


// [EXPORT] //
export default BlockService