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
async function s_readAllAll(amount, pageNumber) {
	const authAxios = await this.authAxios()
	const skip = pageNumber * amount

	const result = new Promise ((resolve, reject) => {
		authAxios.get(`/read-all/${amount}/${skip}`)
			.then((res) => {
				let returnedData = res.data.blocks

				// Reformat
				returnedData = returnedData.map(block => ({
					...block,
					createdAt: new Date(block.createdAt).toLocaleString()
				}))
				
				resolve(returnedData)
			})
			.catch((err) => { reject(err) })
	})

	return result
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