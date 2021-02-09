// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/mail',
		headers: {
			authorization: `Bearer ${localStorage.usertoken}`,
			authorization2: `Bearer ${localStorage.admintoken}`
		}
	})
}


/******************* [URL + PORT] *******************/
async function s_getQuote(type, email, name, subject, message) {
	const authAxios = await this.authAxios()

	return (
		await authAxios.post(
			'/get-quote',
			{
				type: type,
				email: email,
				name: name,
				subject: subject,
				message: message,
			}
		)
	).data
}


// [EXPORT] //
export default {
	authAxios,
	s_getQuote
}