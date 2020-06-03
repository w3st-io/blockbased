/**
 * %%%%%%%%%%%%%%%%%%%%% *
 * %%% POST SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%% *
 * Ordered by "CRRUD" first then 
 * alphabeticaly for everything 
 * else 
*/
/*** [IMPORT] ***/
import axios from 'axios'

/*** [C] Post Services ***/
class BlockService {
	// [CREATE] Create Posts //
	static createBlock(title, cat_id) {
		return axios.post('/api/blocks/create', {
			title,
			cat_id
		})
	}

	// [READ] Get Posts //
	static getAllBlocks() {
		// Get the Posts from the server //
		let result = new Promise ((resolve, reject) => {
			axios
				.get(`/api/blocks/read-all`)
				.then((res) => {
					const data = res.data
					resolve(
						data.map((block) => ({
							...block,
							createdAt: new Date(block.createdAt)
						}))
					)
				})
				.catch((err)=> { reject(err) })
		})

		// [RETURN] Result of Promise //
		return result
	}

	// [DELETE] Delete Posts //
	static deletePost(id) {
		return axios.delete(`/api/posts/delete/${id}`)
	}
	////////////////////////// CRRUD DONE ///////////////////////////

}

/*** [EXPORT] ***/
export default BlockService