/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
/*** [IMPORT] ***/
import axios from 'axios'

class BlockService {
	/******************* [COMMENT CRUD] *******************/
	// [CREATE]
	static createComment(block_id, email, comment) {
		return axios.post(`/api/blocks/create`, {
			block_id,
			email,
			comment
		})	
	}

	/******************* [COMMENT IDS CRUD] *******************/
	// [CREATE]
	static createCommentId(block_id, comment_id) {
		return axios.post(`/api/blocks/comment-id/create`, {
			block_id,
			comment_id
		})
	}

	// [READ-ALL]
	static getCommentIds(block_id) {
		let result = new Promise ((resolve, reject) => {
			axios
				.get(`/api/blocks/comment-id/read-all/${block_id}`)
				.then((res) => {
					const data = res.data
					resolve(
						data.map((blocksXComments) => ({
							...blocksXComments,
						}))
					)
				})
				.catch((err) => { reject(err) })
		})

		// [RETURN] //
		return result
	}

	// [READ]
	static getCommentDetailsWithId(comment_id) {
		let result = new Promise ((resolve, reject) => {
			axios
				.get(`/api/blocks/comment-id/read/${comment_id}`)
				.then((res) => {
					const data = res.data
					console.log('bs', data)
					resolve(
						data.map((comment) => ({
							...comment,
							createdAt: new Date(comment.createdAt)
						}))
					)
				})
				.catch((err) => { reject(err) })
		})

		// [RETURN] //
		return result
	}
}

/*** [EXPORT] ***/
export default BlockService