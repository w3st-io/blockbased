/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION REPORTS SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/administration/reports',
		headers: { authorization2: `Bearer ${localStorage.admintoken}` }
	})
}


/******************* [CRUD] *******************/
// [READ-ALL-ALL] Auth Required //
async function s_readAllAll() {
	const authAxios = await this.authAxios()

	try {
		const returned = await authAxios.get('/read-all')
		console.log(returned.data)

		return returned.data
	}
	catch (e) { return { status: false, message: `Caught Error --> ${e}` } }
}

// [DELETE] Auth Required //
async function s_delete(report_id) {
	const authAxios = await this.authAxios()

	let result = new Promise ((resolve, reject) => {
		authAxios.delete(`/delete/${report_id}`)
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