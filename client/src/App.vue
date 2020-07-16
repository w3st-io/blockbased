<template>
	<div id="app">
		<!-- Hidden Side Menu -->
		<side-menu />

		<!-- Admin Bottom Bar -->
		<admin-nav-bar
			v-if="adminLoggedIn"
			:key="adminNavBarKey"
		/>

		<!-- Top Bar -->
		<nav-bar :key="navBarKey" />

		<!-- Display the router Stuff -->
		<router-view :key="routerViewKey" />

		<!-- Bottom Footer -->
		<Footer />
	</div>
</template>

<script>
	// [IMPORT] Personal //
	import AdminNavBar from '@components/admin/AdminNavBar'
	import Footer from '@components/nav/Footer'
	import NavBar from '@components/nav/NavBar'
	import SideMenu from './components/nav/SideMenu'
	import UserService from './services/UserService'
	import { EventBus } from '@main'

	// [EXPORT] //
	export default {
		name: 'App',
		components: {
			AdminNavBar,
			Footer,
			NavBar,
			SideMenu,
		},

		data: function() {
			return {
				decoded: '',
				adminNavBarKey: 0,
				navBarKey: 1,
				routerViewKey: 2,
				adminLoggedIn: false,
				loggedIn: false,
			}
		},

		created: function() {
			// [DECODE] //
			if (localStorage.usertoken) {
				this.decoded = UserService.getUserTokenDecodeData()
			}

			// [CHECK IF ADMINLOGGEDIN] //
			if (localStorage.admintoken) { this.adminLoggedIn = true }

			// [--> EMIT IN] //
			EventBus.$on('logged-in', () => {
				this.loggedIn = true
				this.forceRerender()
			})

			EventBus.$on('admin-logged-in', () => {
				this.adminLoggedIn = true
				this.adminForceRerender()
			})
			
			EventBus.$on('admin-logged-out', () => { this.adminForceRerender() })
			EventBus.$on('force-rerender', () => { this.forceRerender() })

			// [LOG] //
			this.log()
		},

		methods: {
			forceRerender() {
				this.adminNavBarKey += 1
				this.routerViewKey += 1
				this.navBarKey += 1

				this.decoded = UserService.getUserTokenDecodeData()
				
				console.log(localStorage.usertoken)
				console.log('Forced Rerendered')
			},

			adminForceRerender() {
				this.adminLoggedIn = false

				this.adminNavBarKey += 1
				this.routerViewKey += 1
				this.navBarKey += 1
				
				console.log('Admin Forced Rerendered')
			},

			log() {
				console.log('%%% [APP] App %%%')
				console.log('usertoken:', localStorage.usertoken)
				console.log('admintoken:', localStorage.admintoken)
				console.log('decoded:', this.decoded)
			}
		}
	}
</script>

<style scoped>
	#app {
		font-family:
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			'Open Sans',
			'Helvetica Neue', 
			sans-serif
		;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
</style>
