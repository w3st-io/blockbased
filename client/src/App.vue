<template>
	<div id="app" :key="appKey">
		<!-- UI -->
		<UI />

		<!-- Router -->
		<RouterView :key="$route.name + ($route.params.id || '')" />

		<!-- Bottom Footer -->
		<Footer />
	</div>
</template>

<script>
	// [IMPORT] //
	import io from 'socket.io-client'

	// [IMPORT] Personal //
	import Footer from '@components/nav/Footer'
	import UI from '@components/UI'
	import Service from '@services/Service'
	import UserService from '@services/UserService'
	import { EventBus } from '@main'

	// [EXPORT] //
	export default {
		name: 'App',

		components: {
			Footer,
			UI,
		},

		data() {
			return {
				appKey: 0,
				socket: 5000,
				decoded: {},
				reqData: {},
			}
		},

		created: async function() {
			await this.setSocket()

			await this.userTasks()

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
			forceRerender() { this.appKey++ },

			async setSocket() {
				try {
					this.reqData = await Service.getSocketBaseUrl()

					if (this.reqData) { this.socket = io(this.reqData) }
				}
				catch (err) { `App: Error --> ${err}` }				
			},

			async userTasks() {
				try {
					// [USER] //
					if (localStorage.usertoken) {
						this.decoded = await UserService.s_getUserTokenDecodeData()

						this.socket.emit('join', this.decoded.user_id)
					}
				}
				catch (err) { `App: Error --> ${err}` }
			},

			async handleUserLoggedIn() {
				this.decoded = await UserService.s_getUserTokenDecodeData()

				this.forceRerender()

				// [SOCKET] //
				this.socket.emit('join', this.decoded.user_id)
			},

			async handleUserLoggedOut() {
				this.forceRerender()

				// [SOCKET] //
				this.socket.emit('leave')
			},

			async handleAdminLoggedIn() { this.forceRerender() },

			async handleAdminLoggedOut() { this.forceRerender() },

			async updateNotifications() { EventBus.$emit('update-notification') },

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