/**
 * %%%%%%%%%%%%%%%%%%%%%%
 * %%% BLOCK SERVICES %%%
 * %%%%%%%%%%%%%%%%%%%%%%
 * Order by route
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
const authAxios = async () => {
	return axios.create({
		baseURL: '/pages',
		headers: {
			authorization: `Bearer ${localStorage.usertoken}`,
			authorization2: `Bearer ${localStorage.admintoken}`
		}
	})
}


// [HOME] //
async function s_home() {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.get('/')).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			error: `PageService: Error --> ${err}`
		}
	}
}


// [ACTIVITY] //
async function s_activity(sort = 0, limit, page) {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.get(`/activity/${sort}/${limit}/${page}`)).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			error: `PageService: Error --> ${err}`
		}
	}
}


// [ADMIN] //
async function s_admin() {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.get('/admin')).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			error: `PageService: Error --> ${err}`
		}
	}
}


async function s_admin_function() {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.get('/admin/function')).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			error: `PageService: Error --> ${err}`
		}
	}
}


async function s_admin_function_commentReports(sort, limit, page) {
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
			error: `PageService: Error --> ${err}`
		}
	}
}


async function s_admin_function_comments(sort, limit, page) {
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
			error: `PageService: Error --> ${err}`
		}
	}
}


async function s_admin_function_posts(sort, limit, page) {
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
			error: `PageService: Error --> ${err}`
		}
	}
}


async function s_admin_function_users(sort, limit, page) {
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
			error: `PageService: Error --> ${err}`
		}
	}
}


async function s_admin_function_users_record(user_id) {
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
			error: `PageService: Error --> ${err}`
		}
	}
}


// [CAT] //
async function s_cat(cat_id, sort = 0, limit, page) {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.get(`/cat/${cat_id}/${sort}/${limit}/${page}`)).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			error: `PageService: Error --> ${err}`
		}
	}
}


// [POST] //
async function s_post(post_id, limit, page) {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.get(`/post/${post_id}/${limit}/${page}`)).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `PageService: Error --> ${err}`
		}
	}
}


async function s_post_create() {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.get(`/post/create`)).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			error: `PageService: Error --> ${err}`
		}
	}
}


// [COMMENT] //
async function s_comment_create(post_id) {
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
}


async function s_comment_edit(comment_id) {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.get(`/comment/edit/${comment_id}`)).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `PageService: Error --> ${err}`
		}
	}
}


async function s_comment_reply(comment_id) {
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
}


// [USER] //
async function s_user_activity(sort = 0, limit, page) {
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
}


// [USER] //
async function s_user_activity_lookup(user_id, sort = 0, limit, page) {
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
}


async function s_user_followed(limit, page) {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.get(`/user/followed/${limit}/${page}`)).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `PageService: Error --> ${err}`
		}
	}
}


async function s_user_notifications(sort = 0, limit, page) {
	console.log(sort);
	try {
		const authAxios = await this.authAxios()

		return (
			await authAxios.get(`/user/notification/${sort}/${limit}/${page}`)
		).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `PageService: Error --> ${err}`
		}
	}
}


async function s_user_profile() {
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
}


async function s_user_profile_lookup(user_id) {
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
	
}


// [EXPORT] //
export default {
	authAxios,
	s_home,
	s_activity,
	s_admin,
	s_admin_function,
	s_admin_function_commentReports,
	s_admin_function_comments,
	s_admin_function_posts,
	s_admin_function_users,
	s_admin_function_users_record,
	s_cat,
	s_post,
	s_post_create,
	s_comment_create,
	s_comment_edit,
	s_comment_reply,
	s_user_activity,
	s_user_activity_lookup,
	s_user_followed,
	s_user_notifications,
	s_user_profile,
	s_user_profile_lookup,
}