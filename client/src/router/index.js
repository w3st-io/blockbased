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
import activity from '../pages/activity'
// [ADMIN] //
import admin from '@pages/admin'
import admin_login from '@pages/admin/login'
import admin_profile from '@pages/admin/profile'
import admin_register from '@pages/admin/register'
// [CAT] //
import cat from '@pages/cat'
import cat_PostCreate from '@pages/cat/post-create'
// [POST] //
import post from '@pages/post'
import post_commentCreate from '@pages/post/comment-create'
import post_commentEdit from '@pages/post/comment-edit'
import post_commentReply from '@pages/post/comment-reply'
// [USER] //
import user_activity from '@pages/user/activity'
import user_accountCreated from '@pages/user/account-created'
import user_followed from '@pages/user/followed'
import user_login from '@pages/user/login'
import user_notifications from '@pages/user/notifications'
import user_passwordRequest from '@pages/user/password/request'
import user_passwordReset from '@pages/user/password/reset'
import user_profile from '@pages/user/profile'
import user_profileEdit from '@pages/user/profile/edit'
import user_profileView from '@pages/user/profile/view'
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
			path: '/admin/a-login',
			name: 'a-login',
			component: admin_login,
			meta: {
				auth: true,
				title: 'Admin Login'
			}
		},
		{
			path: '/admin/a-profile',
			name: 'a-profile',
			component: admin_profile,
			meta: {
				auth: true,
				title: 'Admin Profile'
			}
		},
		{
			path: '/admin/a-register',
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
		{
			path: '/cat/post-create/:cat_id',
			name: 'post-create',
			component: cat_PostCreate,
			meta: {
				auth: true,
				title: 'Create a Post'
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
			path: '/post/comment-create/:post_id',
			name: 'comment-create',
			component: post_commentCreate,
			meta: {
				auth: true,
				title: 'Create Comment'
			}
		},
		{
			path: '/post/comment-edit/:comment_id',
			name: 'comment-edit',
			component: post_commentEdit,
			meta: {
				auth: true,
				title: 'Edit Comment'
			}
		},
		{
			path: '/post/comment-reply/:comment_id',
			name: 'comment-reply',
			component: post_commentReply,
			meta: {
				auth: true,
				title: 'Reply to Comment'
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
			path: '/user/activity',
			name: 'user_activity',
			component: user_activity,
			meta: {
				auth: true,
				title: 'Your Activity'
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
			path: '/user/notifications',
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
			component: user_passwordRequest,
			meta: {
				auth: true,
				title: 'Request for Password Reset'
			}
		},
		{
			path: '/user/password/reset/:user_id/:verification_code',
			name: 'reset-password',
			component: user_passwordReset,
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
			component: user_profileEdit,
			meta: {
				auth: true,
				title: 'Edit Your Profile'
			}
		},
		{
			path: '/user/profile/view/:user_id',
			name: 'profile-view',
			component: user_profileView,
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