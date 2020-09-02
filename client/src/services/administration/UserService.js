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
		headers: { authorization2: `Bearer ${localStorage.admintoken}` }
	})
}


/******************* [USER PROFILE] *******************/
// [READ-ALL] Auth Required //
async function s_readAll() {
	const authAxios = await this.authAxios()

	try {
		const returned = await authAxios.get(`/read-all/profile-data`)

		return returned.data
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `UserService: Caught Error --> ${e}`
		}
	}
}

// [READ] Auth Required //
async function s_read(user_id) {
	const authAxios = await this.authAxios()

	try {
		const returned = await authAxios.get(`/read/${user_id}`)

		return returned.data
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `UserService: Caught Error --> ${e}`
		}
	}
}

// [UPDATE] Auth Required //
async function s_update(user_id, img_url) {
	const authAxios = await this.authAxios()

	try {
		const returned = await authAxios.post(`/update/${user_id}`, { img_url })

		return returned.data
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `UserService: Caught Error --> ${e}`
		}
	}
	
}

/******************* [USER PROFILE] *******************/
async function s_banUser(user_id, hours) {
	const authAxios = await this.authAxios()

	try {
		const returned = await authAxios.post(`/ban/${user_id}`, { hours })
	
		return returned.data
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `UserService: Caught Error --> ${e}`
		}
	}
}


// [EXPORT] //
export default {
	authAxios,
	s_readAll,
	s_read,
	s_update,
	s_banUser,
}