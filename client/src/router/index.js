// [IMPORT] //
import Vue from 'vue'
import Router from 'vue-router'

// [IMPORT] Personal //
import Admin from '@pages/admin'
import AdminLogin from '@pages/admin/AdminLogin'
import AdminProfile from '@pages/admin/AdminProfile'
import AdminRegister from '@pages/admin/AdminRegister'
import Block from '@pages/block'
import CommentCreate from '@pages/block/CommentCreate'
import CommentEdit from '@pages/block/CommentEdit'
import Cat from '@pages/cat'
import BlockCreate from '@pages/cat/BlockCreate'
import Forum from '@pages/Forum'
import Login from '@pages/user/Login'
import Profile from '@pages/user/Profile'
import ProfileEdit from '@pages/user/ProfileEdit'
import ProfileView from '../pages/user/ProfileView'
import Register from '@pages/user/Register'
import NotFound from '@pages/404'
import z from '@pages/z'

// [USE] //
Vue.use(Router)

// [EXPORT] //
const router = new Router ({
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
				title: 'Post -'
			}
		},
		{
			path: '/block-comment-create/:block_id',
			name: 'CommentCreate',
			component: CommentCreate,
			meta: {
				auth: true,
				title: 'Create Comment'
			}
		},
		{
			path: '/block-comment-edit/:comment_id',
			name: 'CommentEdit',
			component: CommentEdit,
			meta: {
				auth: true,
				title: 'Edit Comment'
			}
		},
		{
			path: '/cat/:cat_id/:page',
			name: 'Cat',
			component: Cat,
			meta: {
				auth: true,
				title: `Cat -`
			}
		},
		{
			path: '/cat/block-create/:cat_id',
			name: 'BlockCreate',
			component: BlockCreate,
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
			path: '/profile/edit',
			name: 'ProfileEdit',
			component: ProfileEdit,
			meta: {
				auth: true,
				title: 'Edit Your Profile'
			}
		},
		{
			path: '/profile/view/:user_id',
			name: 'ProfileView',
			component: ProfileView,
			meta: {
				auth: true,
				title: ''
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


// [VUE-ROUTER-SET-TITLE] //
router.beforeEach((to, from, next) => {
	document.title = to.meta.title
	next()
})


export default router