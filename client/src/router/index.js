// [IMPORT] //
import Vue from 'vue'
import Router from 'vue-router'


// [IMPORT] Personal (Ordered by path) //
import companyInfo from '@/defaults/companyInfo'
// Index //
import index from '@/pages'
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
// Asset //
import asset from '@/pages/asset'
// Cat //
import cat from '@/pages/cat'
// Comment //
import comment_create from '@/pages/comment/create'
import comment_edit from '@/pages/comment/edit'
import comment_reply from '@/pages/comment/reply'
// Email //
import emailSent from '@/pages/email-sent'
// Example //
import example from '@/pages/example'
import example_bcarousel from '@/pages/example/bcarousel'
import example_conveyor from '@/pages/example/conveyor'
import example_getQuote from '../pages/example/get-quote'
import example_parallax from '@/pages/example/parallax'
import example_hoursAndContact from '@/pages/example/hours-and-contact'
// Followed //
import followed from '@/pages/followed'
// Home //
import home from '@/pages/home'
// Notification //
import notification from '@/pages/notification'
// Post //
import post from '@/pages/post'
import post_create from '@/pages/post/create'
// User //
import user_activity from '@/pages/user/activity'
import user_activity_lookup from '@/pages/user/activity/lookup'
import user_login from '@/pages/user/login'
import user_password_change from '@/pages/user/password/change'
import user_password_request from '@/pages/user/password/request'
import user_password_reset from '@/pages/user/password/reset'
import user_profile from '@/pages/user/profile'
import user_profile_edit from '@/pages/user/profile/edit'
import user_profile_lookup from '@/pages/user/profile/lookup'
import user_verify from '@/pages/user/verify'
import user_register from '@/pages/user/register'
import user_registered from '@/pages/user/registered'
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
		// Index //
		{
			path: '/',
			name: '/',
			component: index,
			meta: {
				auth: true,
				title: 'Home'
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
		// Asset //
		{
			path: '/asset/:exchange/:product_id/:timeframe',
			name: 'asset',
			component: asset,
			meta: {
				auth: true,
				title: 'Asset'
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
		// Email //
		{
			path: '/email-sent',
			name: 'email-sent',
			component: emailSent,
			meta: {
				auth: true,
				title: 'Email Sent'
			},
		},
		// Components //
		{
			path: '/example',
			name: 'example',
			component: example,
			meta: {
				auth: true,
				title: 'Example'
			},
		},
		{
			path: '/example/bcarousel',
			name: 'example_bcarousel',
			component: example_bcarousel,
			meta: {
				auth: true,
				title: 'Example Carousel'
			},
		},
		{
			path: '/example/conveyor',
			name: 'example_conveyor',
			component: example_conveyor,
			meta: {
				auth: true,
				title: 'Example Carousel'
			},
		},
		{
			path: '/example/get-quote',
			name: 'example_get-quote',
			component: example_getQuote,
			meta: {
				auth: true,
				title: 'Example Get Quote'
			},
		},
		{
			path: '/example/hours-and-contact',
			name: 'example_hours-and-contact',
			component: example_hoursAndContact,
			meta: {
				auth: true,
				title: 'Example Hours and Contact'
			},
		},
		{
			path: '/example/parallax',
			name: 'example_parallax',
			component: example_parallax,
			meta: {
				auth: true,
				title: 'Example Parallax'
			},
		},
		// Followed //
		{
			path: '/followed/:page',
			name: 'followed',
			component: followed,
			meta: {
				auth: true,
				title: 'Posts You Are Following'
			}
		},
		// Home //
		{
			path: '/home',
			name: 'home',
			component: home,
			meta: {
				auth: true,
				title: 'Home'
			},
		},
		// Notifications //
		{
			path: '/notification/:sort/:limit/:page',
			name: 'notification',
			component: notification,
			meta: {
				auth: true,
				title: 'notification'
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
			path: '/user/login',
			name: 'user_login',
			component: user_login,
			meta: {
				auth: true,
				title: 'Login'
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
			path: '/user/registered',
			name: 'user_registered',
			component: user_registered,
			meta: {
				auth: true,
				title: 'Successfully Created Account'
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
			path: '/search/:query/:tab/:type/:limit/:page',
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
	],
	
	// [VUE-ROUTER] Scroll Behavior //
	scrollBehavior () { return { x: 0, y: 0 } }
})


// [VUE-ROUTER-SET-TITLE] //
router.beforeEach((to, from, next) => {
	document.title = to.meta.title + ' - ' + companyInfo.companyName
	next()
})


export default router