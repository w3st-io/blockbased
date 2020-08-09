/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% FOLLOWS SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/follows',
		headers: { authorization: `Bearer ${localStorage.usertoken}` }
	})
}


// [EXPORT] //
export default {
	authAxios,
}