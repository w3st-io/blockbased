/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% UTILS INDEX %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/',
		headers: { authorization: `Bearer ${localStorage.usertoken}` }
	})
}


/******************* [URL + PORT] *******************/
async function getBaseUrl() {
	const authAxios = await this.authAxios()

	const { data } = await authAxios.get('/get-base-url')

	return data
}


// [EXPORT] //
export default {
	authAxios,
	getBaseUrl
}