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
	// [READ-ALL] ALL - Auth Required //
	static getAllBlocks(amount, pageNumber) {
		let skip = pageNumber * amount

		let result = new Promise ((resolve, reject) => {
			authAxios.get(`/read-all/${amount}/${skip}`)
				.then((res) => {
					const returnedData = res.data
					resolve(
						returnedData.map((block) => ({
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