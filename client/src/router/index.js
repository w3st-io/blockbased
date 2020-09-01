// [IMPORT] //
import Vue from 'vue'
import Router from 'vue-router'

// [IMPORT] Personal //
import Admin from '@pages/admin'
import AdminLogin from '@pages/admin/AdminLogin'
import AdminProfile from '@pages/admin/AdminProfile'
import AdminRegister from '@pages/admin/AdminRegister'
import Post from '@pages/post'
import CommentCreate from '@pages/post/CommentCreate'
import CommentEdit from '@pages/post/CommentEdit'
import Cat from '@pages/cat'
import PostCreate from '@pages/cat/PostCreate'
import Forum from '@pages/Forum'
import Login from '@pages/user/Login'
import Profile from '@pages/user/Profile'
import ProfileEdit from '@pages/user/ProfileEdit'
import ProfileView from '@pages/user/ProfileView'
import Verify from '../pages/user/Verify'
import Register from '@pages/user/Register'
import z from '@pages/z'
import NotFound from '@pages/404'

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
				title: 'BlockBased.io'
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
			path: '/post/:post_id/:page',
			name: 'Post',
			component: Post,
			meta: {
				auth: true,
				title: 'Post -'
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
			path: '/cat/post-create/:cat_id',
			name: 'PostCreate',
			component: PostCreate,
			meta: {
				auth: true,
				title: 'Create a Post'
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
			path: '/post-comment-create/:post_id',
			name: 'CommentCreate',
			component: CommentCreate,
			meta: {
				auth: true,
				title: 'Create Comment'
			}
		},
		{
			path: '/post-comment-edit/:comment_id',
			name: 'CommentEdit',
			component: CommentEdit,
			meta: {
				auth: true,
				title: 'Edit Comment'
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
			path: '/verify/:user_id/:verification_code',
			name: 'Verify',
			component: Verify,
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