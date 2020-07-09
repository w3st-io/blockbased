/**
 * %%%%%%%%%%%%%%%%%%%%%%% *
 * %%% REPORT SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH TOKEN SETUP] //
const token = localStorage.usertoken
const authAxios = axios.create({
	baseURL: '/api/reports',
	headers: {
		authorization: `Bearer ${token}`
	}
})


class ReportService {
	/******************* [CRRUD] *******************/
	// [CREATE] Auth Required //
	static async createReport(block_id, comment_id, reportType) {
		let status = await authAxios.post('/create', {
			block_id, comment_id, reportType
		})

		return status
	}
}


// [EXPORT] //
export default ReportService