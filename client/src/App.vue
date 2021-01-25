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
	import utils from '@utils'
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

			// Get Initial Notifications //
			await this.updateNotifications()

			// [ON-SOCKET] //
			this.socket.on('update-notification', () => {
				setTimeout(() => { EventBus.$emit('update-notification') }, 1500)
			})

			EventBus.$on('logged-in', () => { this.handleUserLoggedIn() })

			EventBus.$on('logged-out', () => { this.handleUserLoggedOut() })

			EventBus.$on('admin-logged-in', () => { this.handleAdminLoggedIn() })

			EventBus.$on('admin-logged-out', () => { this.handleAdminLoggedOut() })

			EventBus.$on('force-rerender', () => { this.forceRerender() })

			// [LOG] //
			//this.log()
		},

		methods: {
			async setSocket() {
				try {
					this.reqData = await utils.getSocketBaseUrl()

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
	
						this.socket.emit('admin-join')
					}
				}
				catch (err) { `App: Error --> ${err}` }
			},

			handleUserLoggedIn() {
				this.socket.emit('join', this.decoded.user_id)

				this.loggedIn = true
				
				this.forceRerender()
			},

			handleUserLoggedOut() {
				this.socket.emit('leave')

				localStorage.removeItem('usertoken')

				this.loggedIn = false

				this.forceRerender()
			},

			handleAdminLoggedIn() {
				this.adminLoggedIn = true

				this.forceRerender()
			},

			handleAdminLoggedOut() {
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