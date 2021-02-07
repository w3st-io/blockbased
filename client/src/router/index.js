// [IMPORT] //
import Vue from 'vue'
import Router from 'vue-router'


// [IMPORT] Personal (Ordered by path) //
// Home //
import home from '@/pages'
// Activity //
import activity from '@/pages/activity'
// Admin //
import admin from '@/pages/admin'
import admin_function_commentReports from '@/pages/admin/function/comment-reports'
import admin_function_comments from '@/pages/admin/function/comments'
import admin_function_posts from '@/pages/admin/function/posts'
import admin_function_users from '@/pages/admin/function/users'
import admin_login from '@/pages/admin/login'
import admin_profile from '@/pages/admin/profile'
import admin_register from '@/pages/admin/register'
// Cat //
import cat from '@/pages/cat'
// Comment //
import comment_create from '@/pages/comment/create'
import comment_edit from '@/pages/comment/edit'
import comment_reply from '@/pages/comment/reply'
// Components //
import components from '@/pages/components'
import components_bcarousel from '@/pages/components/bcarousel'
import components_conveyor from '../pages/components/conveyor'
import components_parallax from '@/pages/components/parallax'
// Post //
import post from '@/pages/post'
import post_create from '@/pages/post/create'
// User //
import user_activity from '@/pages/user/activity'
import user_activity_lookup from '@/pages/user/activity/lookup'
import user_accountCreated from '@/pages/user/account-created'
import user_followed from '@/pages/user/followed'
import user_login from '@/pages/user/login'
import user_notifications from '@/pages/user/notifications'
import user_password_change from '@/pages/user/password/change'
import user_password_request from '@/pages/user/password/request'
import user_password_reset from '@/pages/user/password/reset'
import user_profile from '@/pages/user/profile'
import user_profile_edit from '@/pages/user/profile/edit'
import user_profile_lookup from '@/pages/user/profile/lookup'
import user_verify from '@/pages/user/verify'
import user_register from '@/pages/user/register'
// Search //
import search from '@/pages/search'
// z //
import z from '@/pages/z'
// Not-Found //
import NotFound from '@/pages/404'


// [USE] //
Vue.use(Router)


// [EXPORT] //
const router = new Router ({
	mode: 'history',

	routes: [
		// Home //
		{
			path: '/',
			name: '/',
			component: home,
			meta: {
				auth: true,
				title: 'BlockBased.io'
			}
		},

		// Activity //
		{
			path: '/activity/:sort/:limit/:page',
			name: 'activity',
			component: activity,
			meta: {
				auth: true,
				title: 'Activity'
			}
		},

		// Admin //
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
			name: 'admin_f_comment_reports',
			component: admin_function_commentReports,
			meta: {
				auth: true,
				title: 'Admin-f-comment-reports'
			}
		},
		{
			path: '/admin/function/comments/:sort/:limit/:page',
			name: 'admin_f_comment',
			component: admin_function_comments,
			meta: {
				auth: true,
				title: 'Admin-f-comments'
			}
		},
		{
			path: '/admin/function/posts/:sort/:limit/:page',
			name: 'admin_f_posts',
			component: admin_function_posts,
			meta: {
				auth: true,
				title: 'Admin-f-posts'
			}
		},
		{
			path: '/admin/function/users/:sort/:limit/:page',
			name: 'admin_f_users',
			component: admin_function_users,
			meta: {
				auth: true,
				title: 'Admin-f-users'
			}
		},
		{
			path: '/admin/login',
			name: 'admin_login',
			component: admin_login,
			meta: {
				auth: true,
				title: 'Admin Login'
			}
		},
		{
			path: '/admin/profile',
			name: 'admin_profile',
			component: admin_profile,
			meta: {
				auth: true,
				title: 'Admin Profile'
			}
		},
		{
			path: '/admin/register',
			name: 'admin_register',
			component: admin_register,
			meta: {
				auth: true,
				title: 'Admin Register'
			}
		},

		// Cat //
		{
			path: '/cat/:cat_id/:sort/:limit/:page',
			name: 'cat',
			component: cat,
			meta: {
				auth: true,
				title: `Cat -`
			}
		},
		// Components //
		{
			path: '/components',
			name: 'components',
			component: components,
			meta: {
				auth: true,
				title: 'Components'
			},
		},
		{
			path: '/components/bcarousel',
			name: 'components_bcarousel',
			component: components_bcarousel,
			meta: {
				auth: true,
				title: 'Components Carousel'
			},
		},
		{
			path: '/components/conveyor',
			name: 'components_conveyor',
			component: components_conveyor,
			meta: {
				auth: true,
				title: 'Components Carousel'
			},
		},
		{
			path: '/components/parallax',
			name: 'components_parallax',
			component: components_parallax,
			meta: {
				auth: true,
				title: 'Components Parallax'
			},
		},
		// Comment //
		{
			path: '/comment/create/:post_id',
			name: 'comment_create',
			component: comment_create,
			meta: {
				auth: true,
				title: 'Create Comment'
			}
		},
		{
			path: '/comment/edit/:comment_id',
			name: 'comment_edit',
			component: comment_edit,
			meta: {
				auth: true,
				title: 'Edit Comment'
			}
		},
		{
			path: '/comment/reply/:comment_id',
			name: 'comment_reply',
			component: comment_reply,
			meta: {
				auth: true,
				title: 'Reply to Comment'
			}
		},

		// Post //
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
			name: 'post_create',
			component: post_create,
			meta: {
				auth: true,
				title: 'Create a Post'
			}
		},

		// User //
		{
			path: '/user/account-created',
			name: 'user_account_created',
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
			name: 'user_followed',
			component: user_followed,
			meta: {
				auth: true,
				title: 'Posts You Are Following'
			}
		},
		{
			path: '/user/login',
			name: 'user_login',
			component: user_login,
			meta: {
				auth: true,
				title: 'Login'
			}
		},
		{
			path: '/user/notifications/:sort/:limit/:page',
			name: 'user_notifications',
			component: user_notifications,
			meta: {
				auth: true,
				title: 'notifications'
			}
		},
		{
			path: '/user/password/change',
			name: 'password_change',
			component: user_password_change,
			meta: {
				auth: true,
				title: 'Change Password'
			}
		},
		{
			path: '/user/password/request',
			name: 'user_request',
			component: user_password_request,
			meta: {
				auth: true,
				title: 'Request for Password Reset'
			}
		},
		{
			path: '/user/password/reset/:user_id/:verification_code',
			name: 'user_password_reset',
			component: user_password_reset,
			meta: {
				auth: true,
				title: 'Reset Password'
			}
		},
		{
			path: '/user/profile',
			name: 'user_profile',
			component: user_profile,
			meta: {
				auth: true,
				title: 'Your Profile'
			}
		},
		{
			path: '/user/profile/edit',
			name: 'user_profile_edit',
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

		// Search //
		{
			path: '/search/:query/:type/:limit/:page',
			name: 'search',
			component: search,
			meta: {
				auth: true,
				title: 'Search'
			}
		},

		// Z //
		{
			path: '/z',
			name: 'z',
			component: z,
		},

		// Not-Found //
		{
			path: '/**',
			name: 'not_found',
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