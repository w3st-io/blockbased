<template>
	<div id="app" :key="appKey">
		<!-- Top Bar -->
		<NavBar @menu-btn-clicked="toggle()" />

		<!-- Hidden Side Menu -->
		<SideMenu :sideMenuOpen="sideMenuOpen" @closeMenu="toggle()" />

		<!-- Router -->
		<RouterView :key="$route.name + ($route.params.id || '')" />

		<!-- Bottom Footer -->
		<Footer />

		<!-- Admin Bottom Bar -->
		<AdminNavBar v-if="adminLoggedIn" />

		<!-- Pop Up Notifications -->
		<PopUpNotifications v-if="loggedIn" />

		<!-- Floating Pop Up Banner -->
		<PopUpBanner
			v-if="message"
			:decoded="decoded"
			:message="message"
			BGColor="info"
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
	import Service from '@services/Service'
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

		data() {
			return {
				appKey: 0,
				reqData: {},
				message: '',
				
				// [SOCKET] //
				socket: 5000,

				// [TOKEN] //
				adminLoggedIn: false,
				loggedIn: false,
				decoded: {},

				// [MENU] //
				sideMenuOpen: false
			}
		},

		created: async function() {
			await this.setSocket()

			await this.userTasks()

			await this.adminTasks()

			await this.updateNotifications()

			// [ON-SOCKET] //
			this.socket.on('update-notification', () => {
				setTimeout(() => { EventBus.$emit('update-notification') }, 1500)
			})

			EventBus.$on('user-logged-in', () => { this.handleUserLoggedIn() })

			EventBus.$on('user-logged-out', () => { this.handleUserLoggedOut() })

			EventBus.$on('admin-logged-in', () => { this.handleAdminLoggedIn() })

			EventBus.$on('admin-logged-out', () => { this.handleAdminLoggedOut() })

			EventBus.$on('force-rerender', () => { this.forceRerender() })

			// [LOG] //
			//this.log()
		},

		methods: {
			async setSocket() {
				try {
					this.reqData = await Service.getSocketBaseUrl()

					if (this.reqData) { this.socket = io(this.reqData) }
				}
				catch (err) { `App: Error --> ${err}` }				
			},

			async userTasks() {
				try {
					// [USER-LOGGEDIN] //
					if (localStorage.usertoken) {
						this.loggedIn = true
					
						this.decoded = await UserService.s_getUserTokenDecodeData()

						this.socket.emit('join', this.decoded.user_id)
					}
				}
				catch (err) { `App: Error --> ${err}` }
			},

			async adminTasks() {
				try {
					// [ADMIN-LOGGEDIN] //
					if (localStorage.admintoken) {
						this.adminLoggedIn = true
					}
				}
				catch (err) { `App: Error --> ${err}` }
			},

			async handleUserLoggedIn() {
				this.decoded = await UserService.s_getUserTokenDecodeData()

				this.loggedIn = true

				this.forceRerender()

				this.socket.emit('join', this.decoded.user_id)
			},

			async handleUserLoggedOut() {
				this.loggedIn = false

				this.forceRerender()

				this.socket.emit('leave')
			},

			async handleAdminLoggedIn() {
				this.adminLoggedIn = true

				this.forceRerender()
			},

			async handleAdminLoggedOut() {
				this.adminLoggedIn = false

				this.forceRerender()
			},

			async updateNotifications() { EventBus.$emit('update-notification') },

			toggle() { this.sideMenuOpen = !this.sideMenuOpen },

			forceRerender() { this.appKey++ },

			log() {
				console.log('%%% [APP] %%%')
				console.log('usertoken:', localStorage.usertoken)
				console.log('admintoken:', localStorage.admintoken)
				console.log('reqData:', this.reqData)
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