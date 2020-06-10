/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'

class BlockService {
	// [CREATE] //
	static createBlock(email, title, cat_id) {
		return axios.post('/api/blocks/create', {
			email,
			title,
			cat_id
		})
	}

	// [READ ALL] //
	static getAllBlocks(cat_id) {
		let result = new Promise ((resolve, reject) => {
			axios
				.get(`/api/blocks/read-all/${cat_id}`)
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
}

// [EXPORT] //
export default BlockService