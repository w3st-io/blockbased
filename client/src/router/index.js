/**
 * %%%%%%%%%%%%%%
 * %%% ROUTER %%%
 * %%%%%%%%%%%%%%
 * Order by path
*/
// [IMPORT] //
import Vue from 'vue'
import Router from 'vue-router'


// [IMPORT] Personal //
// [*] //
import home from '@pages'
import NotFound from '@pages/404'
// [ACTIVITY] //
import activity from '@pages/activity'
// [ADMIN] //
import admin from '@pages/admin'
import admin_function_commentReports from '@pages/admin/function/comment-reports'
import admin_function_comments from '@pages/admin/function/comments'
import admin_function_posts from '@pages/admin/function/posts'
import admin_function_users from '@pages/admin/function/users'
import admin_function_users_record from '@pages/admin/function/users/record'
import admin_login from '@pages/admin/login'
import admin_profile from '@pages/admin/profile'
import admin_register from '@pages/admin/register'
// [CAT] //
import cat from '@pages/cat'
// [COMMENT] //
import comment_create from '@pages/comment/create'
import comment_edit from '@pages/comment/edit'
import comment_reply from '@pages/comment/reply'
// [POST] //
import post from '@pages/post'
import post_create from '@pages/post/create'
// [USER] //
import user_activity from '@pages/user/activity'
import user_activity_lookup from '@pages/user/activity/lookup'
import user_accountCreated from '@pages/user/account-created'
import user_followed from '@pages/user/followed'
import user_login from '@pages/user/login'
import user_notifications from '@pages/user/notifications'
import user_password_request from '@pages/user/password/request'
import user_password_reset from '@pages/user/password/reset'
import user_profile from '@pages/user/profile'
import user_profile_edit from '@pages/user/profile/edit'
import user_profile_lookup from '@pages/user/profile/lookup'
import user_verify from '@pages/user/verify'
import user_register from '@pages/user/register'
// [Z] //
import z from '@pages/z'


// [USE] //
Vue.use(Router)


// [EXPORT] //
const router = new Router ({
	mode: 'history',

	routes: [
		// [/] //
		{
			path: '/',
			name: '/',
			component: home,
			meta: {
				auth: true,
				title: 'BlockBased.io'
			}
		},

		// [ACTIVITY] //
		{
			path: '/activity/:sort/:limit/:page',
			name: 'activity',
			component: activity,
			meta: {
				auth: true,
				title: 'Activity'
			}
		},

		// [ADMIN] //
		{
			path: '/admin',
			name: 'admin',
			component: admin,
			meta: {
				auth: true,
				title: 'Admin'
			}
		},
		{
			path: '/admin/function/comment-reports/:sort/:limit/:page',
			name: 'admin-function-comment-reports',
			component: admin_function_commentReports,
			meta: {
				auth: true,
				title: 'Admin-f-comment-reports'
			}
		},
		{
			path: '/admin/function/comments/:sort/:limit/:page',
			name: 'admin-function-comments',
			component: admin_function_comments,
			meta: {
				auth: true,
				title: 'Admin-f-comments'
			}
		},
		{
			path: '/admin/function/posts/:sort/:limit/:page',
			name: 'admin-function-posts',
			component: admin_function_posts,
			meta: {
				auth: true,
				title: 'Admin-f-posts'
			}
		},
		{
			path: '/admin/function/users/:sort/:limit/:page',
			name: 'admin-function-users',
			component: admin_function_users,
			meta: {
				auth: true,
				title: 'Admin-f-users'
			}
		},
		{
			path: '/admin/function/users/record/:user_id',
			name: 'admin-function-users-record',
			component: admin_function_users_record,
			meta: {
				auth: true,
				title: 'Admin-f-users-record'
			}
		},
		{
			path: '/admin/login',
			name: 'a-login',
			component: admin_login,
			meta: {
				auth: true,
				title: 'Admin Login'
			}
		},
		{
			path: '/admin/profile',
			name: 'admin-profile',
			component: admin_profile,
			meta: {
				auth: true,
				title: 'Admin Profile'
			}
		},
		{
			path: '/admin/register',
			name: 'a-register',
			component: admin_register,
			meta: {
				auth: true,
				title: 'Admin Register'
			}
		},

		// [CAT] //
		{
			path: '/cat/:cat_id/:sort/:limit/:page',
			name: 'cat',
			component: cat,
			meta: {
				auth: true,
				title: `Cat -`
			}
		},

		// [COMMENT] //
		{
			path: '/comment/create/:post_id',
			name: 'comment-create',
			component: comment_create,
			meta: {
				auth: true,
				title: 'Create Comment'
			}
		},
		{
			path: '/comment/edit/:comment_id',
			name: 'comment-edit',
			component: comment_edit,
			meta: {
				auth: true,
				title: 'Edit Comment'
			}
		},
		{
			path: '/comment/reply/:comment_id',
			name: 'comment-reply',
			component: comment_reply,
			meta: {
				auth: true,
				title: 'Reply to Comment'
			}
		},

		// [POST] //
		{
			path: '/post/:post_id/:limit/:page',
			name: 'post',
			component: post,
			meta: {
				auth: true,
				title: 'Post -'
			}
		},
		{
			path: '/post/create/:cat_id',
			name: 'post-create',
			component: post_create,
			meta: {
				auth: true,
				title: 'Create a Post'
			}
		},

		// [USER] //
		{
			path: '/user/account-created',
			name: 'account-created',
			component: user_accountCreated,
			meta: {
				auth: true,
				title: 'Successfully Created Account'
			}
		},
		{
			path: '/user/activity/:sort/:limit/:page',
			name: 'user_activity',
			component: user_activity,
			meta: {
				auth: true,
				title: 'Your Activity'
			}
		},
		{
			path: '/user/activity/lookup/:user_id/:sort/:limit/:page',
			name: 'user_activity_lookup',
			component: user_activity_lookup,
			meta: {
				auth: true,
				title: 'Lookup Activity'
			}
		},
		{
			path: '/user/followed/:page',
			name: 'user-followed',
			component: user_followed,
			meta: {
				auth: true,
				title: 'Posts You Are Following'
			}
		},
		{
			path: '/user/login',
			name: 'login',
			component: user_login,
			meta: {
				auth: true,
				title: 'Login'
			}
		},
		{
			path: '/user/notifications/:sort/:limit/:page',
			name: 'notifications',
			component: user_notifications,
			meta: {
				auth: true,
				title: 'notifications'
			}
		},
		{
			path: '/user/password/request',
			name: 'request',
			component: user_password_request,
			meta: {
				auth: true,
				title: 'Request for Password Reset'
			}
		},
		{
			path: '/user/password/reset/:user_id/:verification_code',
			name: 'reset-password',
			component: user_password_reset,
			meta: {
				auth: true,
				title: 'Reset Password'
			}
		},
		{
			path: '/user/profile',
			name: 'profile',
			component: user_profile,
			meta: {
				auth: true,
				title: 'Your Profile'
			}
		},
		{
			path: '/user/profile/edit',
			name: 'edit',
			component: user_profile_edit,
			meta: {
				auth: true,
				title: 'Edit Your Profile'
			}
		},
		{
			path: '/user/profile/lookup/:user_id',
			name: 'user_profile_lookup',
			component: user_profile_lookup,
			meta: {
				auth: true,
				title: ''
			}
		},
		{
			path: '/user/register',
			name: 'register',
			component: user_register,
			meta: {
				auth: true,
				title: 'Register'
			}
		},
		{
			path: '/user/verify/:user_id/:verification_code',
			name: 'verify',
			component: user_verify,
			meta: {
				auth: true,
				title: 'Verfiying your account..'
			}
		},

		// [MISC.] //
		{
			path: '/z',
			name: 'z',
			component: z,
		},

		// [404] //
		{
			path: '/**',
			name: '404',
			component: NotFound,
			meta: {
				auth: true,
				title: '404 Not Found..'
			},
		},
	]
})


// [VUE-ROUTER-SET-TITLE] //
router.beforeEach((to, from, next) => {
	document.title = to.meta.title
	next()
})


export default router