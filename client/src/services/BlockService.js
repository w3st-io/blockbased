/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
/*** [IMPORT] ***/
import axios from 'axios'

class BlockService {
	/******************* [COMMENT CRUD] *******************/
	// [CREATE]
	static createComment(block_id, email, comment) {
		return axios.post(`/api/blocks/create`, {
			block_id,
			email,
			comment
		})	
	}


	// [READ]
	static getComments(block_id, pageNumber) {
		// multiply page nubmer with # comments per page to know how much to skip
		let skip = pageNumber * 5

		let result = new Promise ((resolve, reject) => {
			axios
				.get(`/api/blocks/read/${block_id}/${skip}`)
				.then((res) => {
					const data = res.data
					resolve(
						data.map((comment) => ({
							...comment,
						}))
					)
				})
				.catch((err) => { reject(err) })
		})

		// [RETURN] //
		return result
	}
}

/*** [EXPORT] ***/
export default BlockService