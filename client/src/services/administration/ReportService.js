/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION REPORTS SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH TOKEN SETUP] //
const token = localStorage.admintoken
const authAxios = axios.create({
	baseURL: '/api/administration/reports',
	headers: {
		authorization2: `Bearer ${token}`
	}
})


class AdminstrationReportService {
	/******************* [CRUD] *******************/
	// [READ-ALL] ALL - Auth Required //
	static getAllReports() {
		let result = new Promise ((resolve, reject) => {
			authAxios
				.get(`/read-all`)
				.then((res) => {
					const returnedData = res.data

					resolve(
						returnedData.map((report) => ({
							...report,
							createdAt: new Date(report.createdAt).toLocaleString()
						}))
					)
				})
				.catch((e) => { reject(e) })
		})

		return result
	}


	// [DELETE] Auth Required //
	static deleteReport(report_id) {
		let result = new Promise ((resolve, reject) => {
			authAxios
				.delete(`/delete/${report_id}`)
				.then((res) => { resolve(res) })
				.catch((e) => { reject(e) })
		})

		return result	
	}
}


// [EXPORT] //
export default AdminstrationReportService