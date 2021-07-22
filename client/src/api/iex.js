// [IMPORT] //
import axios from 'axios'


// [IMPORT] Personal //
import store from '@/store'


export default {
	iexSPYNews: async () => {
		try {
			const baseURL = store.state.node_env !== 'development' ? 'https://cloud.iexapis.com/' : 'https://sandbox.iexapis.com'
			const token = store.state.node_env !== 'development' ? store.state.iexKey : store.state.iexSBKey
			const ticker = 'spy'

			const reqURL = `${baseURL}/stable/stock/${ticker}/batch?types=news&token=${token}`

			// [AXIOS] Request //
			const { data } = await axios.get(reqURL)

			return {
				executed: true,
				status: true,
				news: data.news
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: '/client/src/api/iex',
				message: `Caught Error --> ${err}`
			}
		}
	},
}