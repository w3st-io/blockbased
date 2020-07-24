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

		<!-- Floating Pop Up Banner -->
		<notifications
			v-if="false"
			class="ml-auto"
			style="width: 30%;"
		/>

		<PopUpBanner
			v-if="message"
			:message="message"
			:BGColor="'info'"
			style="width: 65%;"
		/>
	</div>
</template>

<script>
	// [IMPORT] Personal //
	import AdminNavBar from '@components/admin/AdminNavBar'
	import notifications from '@components/notifications/notifications'
	import PopUpBanner from './components/misc/PopUpBanner'
	import Footer from '@components/nav/Footer'
	import NavBar from '@components/nav/NavBar'
	import SideMenu from './components/nav/SideMenu'
	import { EventBus } from '@main'

	// [EXPORT] //
	export default {
		name: 'App',
		components: {
			AdminNavBar,
			notifications,
			PopUpBanner,
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
				message: '',
				//message: `Inserting image directly into message will most likely not work due to a cap on messages. Please use a URL for any Images. Thank You!`,
			}
		},

		created: function() {
			// [CHECK IF LOGGEDIN] //
			if (localStorage.usertoken) { this.loggedIn = true }

			// [CHECK IF ADMINLOGGEDIN] //
			if (localStorage.admintoken) { this.adminLoggedIn = true }

			// [--> EMIT IN] //
			EventBus.$on('logged-in', () => {
				this.loggedIn = true
				this.forceRerender()
			})

			// [--> EMIT IN] //
			EventBus.$on('logged-out', () => {
				this.loggedIn = false
				this.forceRerender()
			})

			EventBus.$on('admin-logged-in', () => {
				this.adminLoggedIn = true
				this.forceRerender()
			})
			
			EventBus.$on('admin-logged-out', () => {
				this.adminLoggedIn = false
				this.forceRerender()
			})

			EventBus.$on('force-rerender', () => { this.forceRerender() })

			// [LOG] //
			this.log()
		},

		methods: {
			forceRerender() {
				this.adminNavBarKey += 1
				this.routerViewKey += 1
				this.navBarKey += 1
				
				console.log('ForcedRerender')
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
