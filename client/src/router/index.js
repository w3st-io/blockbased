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
import Admin from '@pages/admin'
import ALogin from '@pages/admin/a-login'
import AProfile from '@pages/admin/a-profile'
import ARegister from '@pages/admin/a-register'
// [CAT] //
import Cat from '@pages/cat'
import PostCreate from '@pages/cat/post-create'
// [POST] //
import Post from '@pages/post'
import CommentCreate from '@pages/post/comment-create'
import CommentEdit from '@pages/post/comment-edit'
import CommentReply from '@pages/post/comment-reply'
// [USER] //
import AccountCreated from '@pages/user/account-created'
import followed from '@pages/user/followed'
import Login from '@pages/user/login'
import notifications from '@pages/user/notifications'
import PasswordRequest from '@pages/user/password/request'
import PasswordReset from '@pages/user/password/reset'
import Profile from '@pages/user/profile'
import ProfileEdit from '@pages/user/profile/edit'
import ProfileView from '@pages/user/profile/view'
import Verify from '@pages/user/verify'
import Register from '@pages/user/register'
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
			path: '/activity/:filter/:limit/:page',
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
			component: Admin,
			meta: {
				auth: true,
				title: 'Admin'
			}
		},
		{
			path: '/admin/a-login',
			name: 'a-login',
			component: ALogin,
			meta: {
				auth: true,
				title: 'Admin Login'
			}
		},
		{
			path: '/admin/a-profile',
			name: 'a-profile',
			component: AProfile,
			meta: {
				auth: true,
				title: 'Admin Profile'
			}
		},
		{
			path: '/admin/a-register',
			name: 'a-register',
			component: ARegister,
			meta: {
				auth: true,
				title: 'Admin Register'
			}
		},

		// [CAT] //
		{
			path: '/cat/:cat_id/:sort/:limit/:page',
			name: 'cat',
			component: Cat,
			meta: {
				auth: true,
				title: `Cat -`
			}
		},
		{
			path: '/cat/post-create/:cat_id',
			name: 'post-create',
			component: PostCreate,
			meta: {
				auth: true,
				title: 'Create a Post'
			}
		},

		// [POST] //
		{
			path: '/post/:post_id/:limit/:page',
			name: 'post',
			component: Post,
			meta: {
				auth: true,
				title: 'Post -'
			}
		},
		{
			path: '/post/comment-create/:post_id',
			name: 'comment-create',
			component: CommentCreate,
			meta: {
				auth: true,
				title: 'Create Comment'
			}
		},
		{
			path: '/post/comment-edit/:comment_id',
			name: 'comment-edit',
			component: CommentEdit,
			meta: {
				auth: true,
				title: 'Edit Comment'
			}
		},
		{
			path: '/post/comment-reply/:comment_id',
			name: 'comment-reply',
			component: CommentReply,
			meta: {
				auth: true,
				title: 'Reply to Comment'
			}
		},

		// [USER] //
		{
			path: '/user/account-created',
			name: 'account-created',
			component: AccountCreated,
			meta: {
				auth: true,
				title: 'Successfully Created Account'
			}
		},
		{
			path: '/user/followed/:page',
			name: 'user-followed',
			component: followed,
			meta: {
				auth: true,
				title: 'Posts You Are Following'
			}
		},
		{
			path: '/user/login',
			name: 'login',
			component: Login,
			meta: {
				auth: true,
				title: 'Login'
			}
		},
		{
			path: '/user/notifications',
			name: 'notifications',
			component: notifications,
			meta: {
				auth: true,
				title: 'notifications'
			}
		},
		{
			path: '/user/password/request',
			name: 'request',
			component: PasswordRequest,
			meta: {
				auth: true,
				title: 'Request for Password Reset'
			}
		},
		{
			path: '/user/password/reset/:user_id/:verification_code',
			name: 'reset-password',
			component: PasswordReset,
			meta: {
				auth: true,
				title: 'Reset Password'
			}
		},
		{
			path: '/user/profile',
			name: 'profile',
			component: Profile,
			meta: {
				auth: true,
				title: 'Your Profile'
			}
		},
		{
			path: '/user/profile/edit',
			name: 'edit',
			component: ProfileEdit,
			meta: {
				auth: true,
				title: 'Edit Your Profile'
			}
		},
		{
			path: '/user/profile/view/:user_id',
			name: 'profile-view',
			component: ProfileView,
			meta: {
				auth: true,
				title: ''
			}
		},
		{
			path: '/user/register',
			name: 'register',
			component: Register,
			meta: {
				auth: true,
				title: 'Register'
			}
		},
		{
			path: '/user/verify/:user_id/:verification_code',
			name: 'verify',
			component: Verify,
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