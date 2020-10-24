<template>
	<div id="app" :key="appKey">
		<!-- Hidden Side Menu -->
		<SideMenu :sideMenuOpen="sideMenuOpen" @closeMenu="toggle()" />

		<!-- Top Bar -->
		<NavBar @menu-btn-clicked="toggle()" />

		<!-- Display the router Stuff -->
		<router-view :key="$route.name + ($route.params.id || '')" />

		<!-- Bottom Footer -->
		<Footer />

		<!-- Admin Bottom Bar -->
		<AdminNavBar v-if="adminLoggedIn" />

		<!-- Pop Up Notifications -->
		<PopUpNotifications
			v-if="loggedIn"
			class="w-100 ml-auto"
			style="max-width: 300px;"
		/>

		<!-- Floating Pop Up Banner -->
		<PopUpBanner
			v-if="message"
			:message="message"
			BGColor="info"
			style="width: 65%;"
		/>
	</div>
</template>

<script>
	// [IMPORT] //
	import io from 'socket.io-client'

	// [IMPORT] Personal //
	import utils from './utils'
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
				// [APP] //
				appKey: 0,
				message: '',
				
				// [SOCKET] //
				socket: '',
				data: {},

				// [USER] //
				adminLoggedIn: false,
				loggedIn: false,
				decoded: {},

				// [MENU] //
				sideMenuOpen: false
			}
		},

		created: async function() {
			// Set Socket //
			await this.setSocket()

			// [LOGGEDIN] //
			if (localStorage.usertoken) {
				this.loggedIn = true
				
				try { this.decoded = await UserService.getUserTokenDecodeData() }
				catch (err) { `App: Error --> ${err}` }

				this.socket.emit('join', this.decoded.user_id)
			}

			// [ADMIN LOGGEDIN] //
			if (localStorage.admintoken) {
				this.adminLoggedIn = true

				this.socket.emit('admin-join')
			}

			// [EMIT-EVENTBUS] Initial get notifications //
			EventBus.$emit('update-notification')

			// [ON-SOCKET] //
			this.socket.on('update-notification', () => {
				setTimeout(() => { EventBus.$emit('update-notification') }, 1500)
			})

			EventBus.$on('logged-in', () => {
				this.socket.emit('join', this.decoded.user_id)
				this.loggedIn = true
				
				this.forceRerender()
			})

			EventBus.$on('logged-out', () => {
				this.socket.emit('leave')
				localStorage.removeItem('usertoken')
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
			//this.log()
		},

		methods: {
			// [SOCKET] //
			async setSocket() {
				// [GET-PORT] //
				try { this.data = await utils.getSocketBaseUrl() }
				catch (err) { `App: Error --> ${err}` }

				if (this.data) { this.socket = io(this.data) }
			},

			// [SIDE-MENU] //
			toggle() { this.sideMenuOpen = !this.sideMenuOpen },

			forceRerender() {
				this.appKey++
				
				console.log('Forced rerender')
			},

			log() {
				console.log('%%% [APP] App %%%')
				console.log('usertoken:', localStorage.usertoken)
				console.log('admintoken:', localStorage.admintoken)
				console.log('data:', this.data)
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