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
import Admin from '@pages/admin'
import ALogin from '@pages/admin/a-login'
import AProfile from '@pages/admin/a-profile'
import ARegister from '@pages/admin/a-register'
import Post from '@pages/post'
import CommentCreate from '@pages/post/comment-create'
import CommentEdit from '@pages/post/comment-edit'
import Cat from '@pages/cat'
import PostCreate from '@pages/cat/post-create'
import Forum from '@pages/forum'
import Login from '@pages/user/login'
import Profile from '@pages/user/profile'
import Edit from '@pages/user/profile/edit'
import View from '@pages/user/profile/view'
import Verify from '../pages/user/verify'
import Register from '@pages/user/register'
import z from '@pages/z'
import NotFound from '@pages/404'


// [USE] //
Vue.use(Router)


// [EXPORT] //
const router = new Router ({
	mode: 'history',

	routes: [
		{
			name: 'forum',
			name: 'forum',
			component: Forum,
			meta: {
				auth: true,
				title: 'BlockBased.io'
			}
		},
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
		{
			path: '/cat/:cat_id/:page',
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
		{
			path: '/post/:post_id/:page',
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
			path: '/user/login',
			name: 'login',
			component: Login,
			meta: {
				auth: true,
				title: 'Login'
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
			component: Edit,
			meta: {
				auth: true,
				title: 'Edit Your Profile'
			}
		},
		{
			path: '/user/profile/view/:user_id',
			name: 'view',
			component: View,
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
		},
		{
			path: '/z',
			name: 'z',
			component: z,
		},
		{
			path: '*',
			name: '404',
			component: NotFound,
			meta: {
				auth: true,
				title: '404 Not Found..'
			},
		},
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