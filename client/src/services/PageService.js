/**
 * %%%%%%%%%%%%%%%%%%%%%%
 * %%% BLOCK SERVICES %%%
 * %%%%%%%%%%%%%%%%%%%%%%
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


// [CAT] //
async function s_cat(cat_id, limit, page, sort) {
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


async function s_post_commentEdit(comment_id) {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.get(`/post/comment-edit/${comment_id}`)).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `PageService: Error --> ${err}`
		}
	}
}


async function s_post_commentReply(comment_id) {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.get(`/post/comment-reply/${comment_id}`)).data
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


async function s_user_notifications(limit, page) {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.get(`/user/notifications/${limit}/${page}`)).data
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


async function s_user_profile_view(user_id) {
	try {
		const authAxios = await this.authAxios()
	
		return (await authAxios.get(`/user/profile/view/${user_id}`)).data
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
	s_admin,
	s_cat,
	s_post,
	s_post_commentEdit,
	s_post_commentReply,
	s_user_followed,
	s_user_notifications,
	s_user_profile,
	s_user_profile_view,
}