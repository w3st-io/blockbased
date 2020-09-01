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
				appKey: 0,
				adminLoggedIn: false,
				loggedIn: false,
				decoded: {},
				message: '',
				socket: io('http://localhost:5000'),
			}
		},

		created: async function() {
			// [CHECK IF LOGGEDIN] //
			if (localStorage.usertoken) {
				this.loggedIn = true
				
				try { this.decoded = await UserService.getUserTokenDecodeData() }
				catch (e) { `App: Caught Error --> ${e}` }

				this.socket.emit('join', this.decoded._id)
			}

			// [CHECK IF ADMINLOGGEDIN] //
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
				this.socket.emit('join', this.decoded._id)
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
			forceRerender() {
				this.appKey++
				
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