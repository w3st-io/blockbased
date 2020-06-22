/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION BLOCK SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'

class AdminstrationBlockService {
	/******************* [CRUD] *******************/
	// [READ ALL] //
	static getAllBlocks(amountPerPage, pageNumber) {
		// multiply page number with # blocks per page to know how much to skip
		let skip = pageNumber * amountPerPage

		let result = new Promise ((resolve, reject) => {
			axios
				.get(`/api/administration/blocks/read-all/${amountPerPage}/${skip}`)
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

	// [DELETE] //
	static deleteBlock(block_id) {
		let result = new Promise ((resolve, reject) => {
			axios.delete(`/api/administration/blocks/delete/${block_id}`)
				.then((res) => { resolve(res) })
				.catch((err) => { reject(err) })
		})

		return result	
	}
}

// [EXPORT] //
export default AdminstrationBlockService