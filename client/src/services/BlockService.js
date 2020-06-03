/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/
/*** [IMPORT] ***/
import axios from 'axios'

class BlockService {
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
				.catch((err)=> { reject(err) })
		})

		// [RETURN] //
		return result
	}
}

/*** [EXPORT] ***/
export default BlockService