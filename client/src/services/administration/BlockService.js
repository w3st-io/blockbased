/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION BLOCK SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH TOKEN SETUP] //
const token = localStorage.admintoken
const authAxios = axios.create({
	baseURL: '/api/administration/blocks',
	headers: {
		authorization2: `Bearer ${token}`
	}
})


class AdminstrationBlockService {
	/******************* [CRUD] *******************/
	// [READ ALL] Auth Required //
	static getAllBlocks(amountPerPage, pageNumber) {
		// multiply page number with # blocks per page to know how much to skip
		let skip = pageNumber * amountPerPage

		let result = new Promise ((resolve, reject) => {
			authAxios.get(`/read-all/${amountPerPage}/${skip}`)
				.then((res) => {
					resolve(
						res.data.map((block) => ({
							...block,
							createdAt: new Date(block.createdAt).toLocaleString()
						}))
					)
				})
				.catch((err) => { reject(err) })
		})

		return result
	}

	// [DELETE] Auth Required //
	static deleteBlock(block_id) {
		let result = new Promise ((resolve, reject) => {
			authAxios.delete(`/blocks/delete/${block_id}`)
				.then((res) => { resolve(res) })
				.catch((err) => { reject(err) })
		})

		return result	
	}
}

// [EXPORT] //
export default AdminstrationBlockService