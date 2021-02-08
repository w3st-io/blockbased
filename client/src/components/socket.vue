<template>
	<div>
	</div>
</template>

<script>
	// [IMPORT] //
	import io from 'socket.io-client'

	// [IMPORT] Personal //
	import Service from '@/services/Service'
	import UserService from '@/services/UserService'
	import { EventBus } from '@/main'

	// [EXPORT] //
	export default {
		data() {
			return {
				socket: null,
				decoded: {},
				reqData: {},
			}
		},

		async created() {
			await this.initializeSocket()

			await this.handleUserLoggedIn()

			await this.updateNotifications()

			this.socket.on('update-notification', () => {
				setTimeout(() => { this.updateNotifications() }, 1500)
			})

			EventBus.$on('user-logged-in', () => {
				this.handleUserLoggedIn()
				EventBus.$emit('force-rerender')
			})

			EventBus.$on('user-logged-out', () => {
				this.handleUserLoggedOut()
				EventBus.$emit('force-rerender')

			})

			EventBus.$on('admin-logged-in', () => {
				this.handleAdminLoggedIn()
				EventBus.$emit('force-rerender')

			})

			EventBus.$on('admin-logged-out', () => {
				this.handleAdminLoggedOut()
				EventBus.$emit('force-rerender')
			})
		},

		methods: {
			async initializeSocket() {
				try {
					this.reqData = await Service.getSocketBaseUrl()

					if (this.reqData) { this.socket = io(this.reqData) }
					else { console.log(`App: Error --> ${this.reqData.message}`) }
				}
				catch (err) { `App: Error --> ${err}` }
			},

			async handleUserLoggedIn() {
				try {
					if (localStorage.usertoken) {
						this.decoded = await UserService.s_getUserTokenDecodeData()

						// [SOCKET] //
						this.socket.emit('join', this.decoded.user_id)
					}
				}
				catch (err) { `App: Error --> ${err}` }
			},

			async handleUserLoggedOut() { this.socket.emit('leave') },

			async handleAdminLoggedIn() {},

			async handleAdminLoggedOut() {},

			async updateNotifications() { EventBus.$emit('update-notification') },
		}
	}
</script>