/**
 * %%%%%%%%%%%%%%%%%%%%% *
 * %%% POST SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%% *
 * Ordered by "CRRUD" first then 
 * alphabeticaly for everything 
 * else 
*/
/*** [IMPORT] ***/
import axios from 'axios'

/*** [C] Post Services ***/
class postsXCommentsService {
	/*/ [CREATE] Create Posts //
	static insertPost(text, email) {
		return axios.post('/api/posts/', {
			text,
			email
		})
	}*/

	// [READ] Get Posts //
	static getCommentIds(block_id) {
		// Get the Posts from the server //
		let result = new Promise ((resolve, reject) => {
			axios
				.get(`/api/blocksXComments/read-all/${block_id}`)
				.then((res) => {
					const data = res.data
					resolve(
						data.map((blocksXComments) => ({
							...blocksXComments,
						}))
					)
				})
				.catch((err)=> { reject(err) })
		})
		// [RETURN] Result of Promise //
		return result
	}

	/*/ [DELETE] Delete Posts //
	static deletePost(id) {
		return axios.delete(`/api/posts/delete/${id}`)
	}*/
	////////////////////////// CRRUD DONE ///////////////////////////

}

/*** [EXPORT] ***/
export default postsXCommentsService