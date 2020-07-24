/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION BLOCK SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


class AdminstrationBlockService {
	// [AUTH-TOKEN-SETUP] //
	static async authAxios() {
		return axios.create({
			baseURL: '/api/administration/blocks',
			headers: {
				authorization2: `Bearer ${localStorage.admintoken}`,
			}
		})
	}

	/******************* [CRUD] *******************/
	// [READ-ALL] ALL - Auth Required //
	static async getAllBlocks(amount, pageNumber) {
		const authAxios = await this.authAxios()
		const skip = pageNumber * amount

		const result = new Promise ((resolve, reject) => {
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
	static async deleteBlock(block_id) {
		const authAxios = await this.authAxios()

		const result = new Promise ((resolve, reject) => {
			authAxios.delete(`/delete/${block_id}`)
				.then((res) => { resolve(res) })
				.catch((err) => { reject(err) })
		})

		return result	
	}
}

// [EXPORT] //
export default AdminstrationBlockService