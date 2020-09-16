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
		const returned = await authAxios.get(`/read-all`)

		return returned.data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserService: Error --> ${err}`
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
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserService: Error --> ${err}`
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
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserService: Error --> ${err}`
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
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserService: Error --> ${err}`
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