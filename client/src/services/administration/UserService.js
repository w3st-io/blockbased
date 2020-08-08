/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION USER SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/administration/users',
		headers: {
			authorization2: `Bearer ${localStorage.admintoken}`,
		}
	})
}

/******************* [USER PROFILE] *******************/
// [READ-ALL] Auth Required //
async function s_readAll() {
	const authAxios = await this.authAxios()

	try {
		const returnedData = await authAxios.get(`/read-all/profile-data`)

		return {
			status: true,
			users: returnedData.data,
		}
	}
	catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
}

// [READ] Auth Required //
async function s_read(user_id) {
	const authAxios = await this.authAxios()

	try {
		const returnedData = await authAxios.get(`/read/${user_id}`)

		return {
			status: true,
			users: returnedData.data,
		}
	}
	catch(e) { return { status: false, message: `Caught Error --> ${e}` } }
}

// [UPDATE] Auth Required //
async function s_update(user_id, img_url) {
	const authAxios = await this.authAxios()

	return await authAxios.post(`/update/${user_id}`,
		{ img_url }
	)
}


// [EXPORT] //
export default {
	authAxios,
	s_readAll,
	s_read,
	s_update,
}