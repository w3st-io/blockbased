<template>
	<div id="app" :key="appKey">
		<!-- Hidden Side Menu -->
		<side-menu />

		<!-- Top Bar -->
		<nav-bar />

		<!-- Display the router Stuff -->
		<router-view :key="$route.name + ($route.params.id || '')" />

		<!-- Bottom Footer -->
		<Footer />

		<!-- Admin Bottom Bar -->
		<admin-nav-bar v-if="adminLoggedIn" />

		<!-- Floating Pop Up Notifications -->
		<PopUpNotifications v-if="loggedIn" class="ml-auto" style="width: 30%;" />

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
				// [SOCKET] //
				socket: '',
				data: {},

				// [USER] //
				adminLoggedIn: false,
				loggedIn: false,
				decoded: {},

				// [APP] //
				appKey: 0,
				message: '',
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

			// [ON-SOCKET] //
			this.socket.on('update-notification', () => {
				setTimeout(() => { EventBus.$emit('update-notification') }, 1500)
			})

			// [EMIT-EVENTBUS] //
			EventBus.$emit('update-notification')

			EventBus.$on('comment-created', (followers) => {
				this.socket.emit('comment-created', followers)
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
			this.log()
		},

		methods: {
			async setSocket() {
				// [GET-PORT] //
				try { this.data = await utils.getBaseUrl() }
				catch (err) { `App: Error --> ${err}` }

				if (this.data) { this.socket = io(this.data) }
			},

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