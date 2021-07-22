// [IMPORT] //
import axios from 'axios'


// [IMPORT] Personal //
import crypto from '@/api/crypto'
//import iexAPI from '@/api/iex'


// [AUTH-TOKEN-SETUP] //
const authAxios = async () => {
	return axios.create({
		baseURL: '/pages',
		headers: {
			user_authorization: `Bearer ${localStorage.usertoken}`,
			admin_authorization: `Bearer ${localStorage.admintoken}`
		}
	})
}

export default {
	authAxios,


	// [HOME] //
	s_home: async function () {
		try {
			const authAxios = await this.authAxios()
	
			const res = await authAxios.get('/')
			
			//res.data.newsObj = await iexAPI.iexSPYNews()

			res.data.btcHistoricRate = (
				await crypto.productHistoricRate({
					exchange: 'coinbase',
					product_id: 'BTC-USD',
					timeFrame: '5m',
					candleCount: 12
				})
			).graph

			res.data.ethHistoricRate = (
				await crypto.productHistoricRate({
					exchange: 'coinbase',
					product_id: 'ETH-USD',
					timeFrame: '5m',
					candleCount: 12
				})
			).graph

			res.data.dogeHistoricRate = (
				await crypto.productHistoricRate({
					exchange: 'coinbase',
					product_id: 'DOGE-USD',
					timeFrame: '5m',
					candleCount: 12
				})
			).graph

			return res.data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},


	// [ACTIVITY] //
	s_activity: async function (sort = 0, limit, page) {
		try {
			const authAxios = await this.authAxios()

			return (await authAxios.get(`/activity/${sort}/${limit}/${page}`)).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},


	// [ADMIN] //
	s_admin: async function () {
		try {
			const authAxios = await this.authAxios()
	
			return (await authAxios.get('/admin')).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},


	s_admin_function: async function () {
		try {
			const authAxios = await this.authAxios()
	
			return (await authAxios.get('/admin/function')).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},


	s_admin_function_commentReports: async function (sort, limit, page) {
		try {
			const authAxios = await this.authAxios()
	
			return (
				await authAxios.get(
					`/admin/function/commentReports/${sort}/${limit}/${page}`
				)
			).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},


	s_admin_function_comments: async function (sort, limit, page) {
		try {
			const authAxios = await this.authAxios()
	
			return (
				await authAxios.get(`/admin/function/comments/${sort}/${limit}/${page}`)
			).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},


	s_admin_function_posts: async function (sort, limit, page) {
		try {
			const authAxios = await this.authAxios()
	
			return (
				await authAxios.get(`/admin/function/posts/${sort}/${limit}/${page}`)
			).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},


	s_admin_function_users: async function (sort, limit, page) {
		try {
			const authAxios = await this.authAxios()
	
			return (
				await authAxios.get(`/admin/function/users/${sort}/${limit}/${page}`)
			).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},


	s_admin_function_users_record: async function (user_id) {
		try {
			const authAxios = await this.authAxios()
	
			return (
				await authAxios.get(`/admin/function/users/record/${user_id}`)
			).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},


	// [ASSET] //
	s_asset: async function ({ exchange, product_id, timeFrame, candleCount }) {
		try {
			const productHistory = await crypto.productHistoricRate({
				exchange: exchange,
				product_id: product_id,
				timeFrame: timeFrame,
				candleCount: candleCount,
			})

			return {
				executed: true,
				status: true,
				graph: productHistory.graph,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},


	// [CAT] //
	s_cat: async function (cat_id, sort = 0, limit, page) {
		try {
			const authAxios = await this.authAxios()
	
			return (
				await authAxios.get(`/cat/${cat_id}/${sort}/${limit}/${page}`)
			).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},


	// [POST] //
	s_post: async function (post_id, limit, page) {
		try {
			const authAxios = await this.authAxios()
	
			const { data } = await authAxios.get(`/post/${post_id}/${limit}/${page}`)
	
			return data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},


	s_post_create: async function () {
		try {
			const authAxios = await this.authAxios()
	
			return (await authAxios.get(`/post/create`)).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},


	// [COMMENT] //
	s_comment_create: async function (post_id) {
		try {
			const authAxios = await this.authAxios()
	
			return (await authAxios.get(`/comment/create/${post_id}`)).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},

	
	s_comment_edit: async function (comment_id) {
		try {
			const authAxios = await this.authAxios()
	
			const reqData = (await authAxios.get(`/comment/edit/${comment_id}`))
	
			return reqData.data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},
	
	
	s_comment_reply: async function (comment_id) {
		try {
			const authAxios = await this.authAxios()
	
			return (await authAxios.get(`/comment/reply/${comment_id}`)).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},

	
	// [FOLLOWED] //
	s_followed: async function (sort, limit, page) {
		try {
			const authAxios = await this.authAxios()
	
			return (
				await authAxios.get(`/followed/${sort}/${limit}/${page}`)
			).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},


	// [NOTIFICATION] //
	s_notification: async function (sort = 0, limit, page) {
		try {
			const authAxios = await this.authAxios()
	
			return (
				await authAxios.get(`/notification/${sort}/${limit}/${page}`)
			).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},
	
	
	// [USER] //
	s_user_activity: async function (sort = 0, limit, page) {
		try {
			const authAxios = await this.authAxios()
	
			return (
				await authAxios.get(`/user/activity/${sort}/${limit}/${page}`)
			).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},
	
	
	s_user_activity_lookup: async function (user_id, sort = 0, limit, page) {
		try {
			const authAxios = await this.authAxios()
	
			return (
				await authAxios.get(
					`/user/activity/lookup/${user_id}/${sort}/${limit}/${page}`
				)
			).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},
	
	
	s_user_profile: async function () {
		try {
			const authAxios = await this.authAxios()
		
			return (await authAxios.get('/user/profile')).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},
	
	
	s_user_profile_edit: async function () {
		try {
			const authAxios = await this.authAxios()
		
			return (await authAxios.get(`/user/profile/edit`)).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `UserService: Error --> ${err}`
			}
		}
	},
	
	
	s_user_profile_lookup: async function (user_id) {
		try {
			const authAxios = await this.authAxios()
		
			return (await authAxios.get(`/user/profile/lookup/${user_id}`)).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},
	

	// [QUOTE] //
	s_quote: async function (query) {
		try {
			const authAxios = await this.authAxios()
			
			return (
				await authAxios.get(`/quote/${query}`)
			).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},

	
	// [SEARCH] //
	s_search: async function (query, type, limit, page) {
		try {
			const authAxios = await this.authAxios()
		
			return (
				await authAxios.get(`/search/${query}/${type}/${limit}/${page}`)
			).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PageService: Error --> ${err}`
			}
		}
	},
}