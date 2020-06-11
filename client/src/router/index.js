// [IMPORT] //
import Vue from 'vue'
import Router from 'vue-router'

// [IMPORT] Personal //
import Admin from '../pages/admin'
import AdminLogin from '../pages/admin/AdminLogin'
import AdminProfile from '../pages/admin/AdminProfile'
import AdminRegister from '../pages/admin/AdminRegister'
import Block from '../pages/block'
import BlockCommentCreate from '../pages/block/blockCommentCreate'
import Cat from '../pages/cat'
import CatBlockCreate from '../pages/cat/CatBlockCreate'
import Forum from '../pages/Forum'
import Login from '../pages/user/Login'
import Profile from '../pages/user/Profile'
import Register from '../pages/user/Register'
import NotFound from '../pages/404'
import z from '../pages/z'

// [USE] //
Vue.use(Router)

// [EXPORT] //
export default new Router ({
	//mode: 'history',

	routes: [
		{
			path: '/',
			name: 'Forum',
			component: Forum,
			meta: {
				auth: true,
				title: 'BlockBased'
			}
		},
		{
			path: '/admin',
			name: 'AdminDashboard',
			component: Admin,
			meta: {
				auth: true,
				title: 'Admin'
			}
		},
		{
			path: '/admin-login',
			name: 'AdminLogin',
			component: AdminLogin,
			meta: {
				auth: true,
				title: 'Admin Login'
			}
		},
		{
			path: '/admin-profile',
			name: 'AdminProfile',
			component: AdminProfile,
			meta: {
				auth: true,
				title: 'Admin Profile'
			}
		},
		{
			path: '/admin-register',
			name: 'AdminRegister',
			component: AdminRegister,
			meta: {
				auth: true,
				title: 'Admin Register'
			}
		},
		{
			path: '/block/:block_id/:page',
			name: 'Block',
			component: Block,
			meta: {
				auth: true,
				title: 'Post Title Here'
			}
		},
		{
			path: '/block-comment-create/:block_id',
			name: 'BlockCommentCreate',
			component: BlockCommentCreate,
			meta: {
				auth: true,
				title: 'Post Title Here'
			}
		},
		{
			path: '/cat/:cat_id/:page',
			name: 'Cat',
			component: Cat,
			meta: {
				auth: true,
				title: 'Cat Name Here'
			}
		},
		{
			path: '/cat/cat-block-create/:cat_id',
			name: 'CatBlockCreate',
			component: CatBlockCreate,
			meta: {
				auth: true,
				title: 'Create a Block'
			}
		},
		{
			path: '/login',
			name: 'Login',
			component: Login,
			meta: {
				auth: true,
				title: 'Login'
			}
		},
		{
			path: '/register',
			name: 'Register',
			component: Register,
			meta: {
				auth: true,
				title: 'Register'
			}
		},
		{
			path: '/profile',
			name: 'Profile',
			component: Profile,
			meta: {
				auth: true,
				title: 'Your Profile'
			}
		},
		{
			path: '/z',
			name: 'Z',
			component: z,
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