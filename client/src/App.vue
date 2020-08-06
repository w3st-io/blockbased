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

		<!-- Floating Pop Up Notifications -->
		<PopUpNotifications
			v-if="loggedIn"
			class="ml-auto"
			style="width: 30%;"
		/>

		<!-- Floating Pop Up Banner -->
		<PopUpBanner
			v-if="message"
			:message="message"
			:BGColor="'info'"
			style="width: 65%;"
		/>
	</div>
</template>

<script>
	// [IMPORT] //
	import io from 'socket.io-client'

	// [IMPORT] Personal //
	import AdminNavBar from '@components/admin/AdminNavBar'
	import PopUpNotifications from '@components/notifications/PopUpNotifications'
	import PopUpBanner from '@components/misc/PopUpBanner'
	import Footer from '@components/nav/Footer'
	import NavBar from '@components/nav/NavBar'
	import SideMenu from '@components/nav/SideMenu'
	import UserService from '@services/UserService'
	import { EventBus } from '@main'

	// [EXPORT] //
	export default {
		name: 'App',
		components: {
			AdminNavBar,
			PopUpNotifications,
			PopUpBanner,
			Footer,
			NavBar,
			SideMenu,
		},

		data: function() {
			return {
				socket: io('http://localhost:5000'),
				adminNavBarKey: 0,
				navBarKey: 1,
				routerViewKey: 2,
				adminLoggedIn: false,
				loggedIn: false,
				message: '',
				test: 1,
				user_id: '',
			}
		},

		created: function() {
			// [CHECK IF LOGGEDIN] //
			if (localStorage.usertoken) {
				this.loggedIn = true
				
				let decoded = UserService.getUserTokenDecodeData()
				this.user_id = decoded._id

				// [EMIT-SOCKET] Join //
				this.socket.emit('join', this.user_id)
			}

			// [CHECK IF ADMINLOGGEDIN] //
			if (localStorage.admintoken) {
				this.adminLoggedIn = true

				// [EMIT-SOCKET] Join //
				this.socket.emit('admin-join')
			}
		
			// [EMIT-EVENTBUS] //
			EventBus.$emit('update-notification')

			// [ON-SOCKET] //
			socket.on('update-notification', () => {
				// [EMIT-EVENTBUS] //
				EventBus.$emit('update-notification')
			})

			// [ON-EVENTBUS] //
			EventBus.$on('logged-in', () => {
				this.loggedIn = true
				this.forceRerender()
			})

			// [ON-EVENTBUS] //
			EventBus.$on('logged-out', () => {
				this.loggedIn = false
				this.forceRerender()
			})

			// [ON-EVENTBUS] //
			EventBus.$on('admin-logged-in', () => {
				this.adminLoggedIn = true
				this.forceRerender()
			})
			
			// [ON-EVENTBUS] //
			EventBus.$on('admin-logged-out', () => {
				this.adminLoggedIn = false
				this.forceRerender()
			})

			// [ON-EVENTBUS] //
			EventBus.$on('force-rerender', () => { this.forceRerender() })

			// [LOG] //
			this.log()
		},

		methods: {
			forceRerender() {
				this.adminNavBarKey += 1
				this.routerViewKey += 1
				this.navBarKey += 1
				
				console.log('Forced rerender')
			},

			log() {
				console.log('%%% [APP] App %%%')
				console.log('usertoken:', localStorage.usertoken)
				console.log('admintoken:', localStorage.admintoken)
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
