/*** [IMPORT] ***/
import Vue from 'vue'
import Router from 'vue-router'

/*** [IMPORT] Personal ***/
import Admin from '../pages/admin'
import AdminLogin from '../pages/admin/AdminLogin'
import AdminProfile from '../pages/admin/AdminProfile'
import AdminRegister from '../pages/admin/AdminRegister'
import SinglePost from '../pages/post-single'
import Home from '../pages/home'
import Login from '../pages/user/Login'
import Profile from '../pages/user/Profile'
import Register from '../pages/user/Register'
import NotFound from '../pages/404'

/*** [USE] ***/
Vue.use(Router)

/*** [EXPORT] ***/
export default new Router ({
	routes: [
		{
			path: '/',
			name: 'Home',
			component: Home,
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
			path: '/login',
			name: 'Login',
			component: Login,
			meta: {
				auth: true,
				title: 'Login'
			}
		},
		{
			path: '/post-single',
			name: 'post-single',
			component: SinglePost,
			meta: {
				auth: true,
				title: 'Post'
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
			path: '/**',
			name: '404',
			component: NotFound,
			meta: {
				auth: true,
				title: '404 Not Found..'
			},
		}
	]
})