/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION BLOCK SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/administration/blocks',
		headers: { authorization2: `Bearer ${localStorage.admintoken}` }
	})
}


/******************* [CRUD] *******************/
// [READ-ALL-ALL] Auth Required //
async function s_readAllAll(limit, pageNumber) {
	const skip = pageNumber * limit
	const authAxios = await this.authAxios()

	try {
		let { data } = await authAxios.get(`/read-all-all/${limit}/${skip}`)
		
		if (data.status) {
			data.blocks.forEach(block => {
				block.createdAt = new Date(block.createdAt).toLocaleString()
			})
		}

		return data
	}
	catch (e) {
		return { status: false, message: `BlockService: Caught Error --> ${e}` }
	}
}

// [DELETE] Auth Required //
async function s_delete(block_id) {
	const authAxios = await this.authAxios()

	const result = new Promise ((resolve, reject) => {
		authAxios.delete(`/delete/${block_id}`)
			.then((res) => { resolve(res) })
			.catch((err) => { reject(err) })
	})

	return result	
}


// [EXPORT] //
export default {
	authAxios,
	s_readAllAll,
	s_delete,
}