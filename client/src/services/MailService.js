// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/mail',
		headers: {
			user_authorization: `Bearer ${localStorage.usertoken}`,
			admin_authorization: `Bearer ${localStorage.admintoken}`
		}
	})
}


export default {
	authAxios,


	s_advanced: async function (formData) {
		try {
			const authAxios = await this.authAxios()
	
			return (await authAxios.post('/advanced', formData)).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `MailService: Error --> ${err}`,
			}
		}
	},
	
	
	s_getQuote: async function ({ subject, clientEmail, name, message }) {
		const authAxios = await this.authAxios()
		
		return (
			await authAxios.post(
				'/get-quote',
				{
					subject: subject,
					clientEmail: clientEmail,
					name: name,
					message: message,
				}
			)
		).data
	},
}