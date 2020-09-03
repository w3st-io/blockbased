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


/******************* [PORT] *******************/
async function getPort() {
	const authAxios = await this.authAxios()

	const returned = await authAxios.get('/get-port')

	return returned
}


// [EXPORT] //
export default {
	authAxios,
	getPort,
}