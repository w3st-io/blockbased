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
	/******************* [CRRUD] *******************/
	// [READ ALL] ALL - Auth Required //
	static getAllBlocks(amount, pageNumber) {
		// multiply page number with # blocks per page to know how much to skip
		let skip = pageNumber * amount

		let result = new Promise ((resolve, reject) => {
			authAxios.get(`/read-all/${amount}/${skip}`)
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
			authAxios.delete(`/delete/${block_id}`)
				.then((res) => { resolve(res) })
				.catch((err) => { reject(err) })
		})

		return result	
	}
}

// [EXPORT] //
export default AdminstrationBlockService