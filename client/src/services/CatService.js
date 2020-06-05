/**
 * %%%%%%%%%%%%%%%%%%%% *
 * %%% CAT SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%% *
*/
/*** [IMPORT] ***/
import axios from 'axios'

class CatService {
	// [CREATE] //
	static createBlock(email, title, cat_id) {
		return axios.post('/api/cats/create', {
			email,
			title,
			cat_id
		})
	}

	// [READ ALL] //
	static getAllBlocks(cat_id) {
		let result = new Promise ((resolve, reject) => {
			axios
				.get(`/api/cats/read-all/${cat_id}`)
				.then((res) => {
					const data = res.data
					resolve(
						data.map((block) => ({
							...block,
							createdAt: new Date(block.createdAt)
						}))
					)
				})
				.catch((err) => { reject(err) })
		})

		// [RETURN] //
		return result
	}

	/* NOT PROGRAMMED YET
	static deleteBlock(id) {
		return axios.delete(`/api/cats/delete/${id}`)
	}
	*/
}

/*** [EXPORT] ***/
export default CatService