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
async function getUrl() {
	const authAxios = await this.authAxios()

	const returned = await authAxios.get('/get-url')

	return returned
}


// [EXPORT] //
export default {
	authAxios,
	getUrl
}