/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
 * %%% ADMINISTRATION REPORTS SERVICES %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/administration/comment-reports',
		headers: {
			authorization: `Bearer ${localStorage.usertoken}`,
			authorization2: `Bearer ${localStorage.admintoken}`
		}
	})
}


/******************* [CRUD] *******************/
// [READ-ALL-ALL] Auth Required //
async function s_readAllAll() {
	try {
		const authAxios = await this.authAxios()
		
		return (await authAxios.get('/read-all')).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `Reports Service: Error --> ${err}`
		}
	}
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


/******************* [MARK-HANDLED-STATUS] *******************/
// [DELETE] Auth Required //
async function s_markHandled(report_id) {
	const authAxios = await this.authAxios()

	let result = new Promise ((resolve, reject) => {
		authAxios.get(`/mark-handled/${report_id}`)
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
	s_markHandled,
}