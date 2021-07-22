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
	// [IMPORT] Personal //
	import Footer from '@/components/UI/nav/Footer'
	import UI from '@/components/UI'
	import { EventBus } from '@/main'
	import Service from '@/services/Service'
	import UserService from '@/services/user/UserService'
	import Socket from '@/socket'

	export default {
		name: 'App',

		components: {
			Footer,
			UI,
		},

		data() {
			return {
				appKey: 0,
				reqData: {},
			}
		},

		methods: {
			async initializeApp() {
				try {
					this.reqData = await Service.index()

					if (this.reqData.status) {
						localStorage.setItem('node_env', this.reqData.node_env)

						this.$store.state.node_env = this.reqData.node_env
						this.$store.state.iexKey = this.reqData.iexKey
						this.$store.state.iexSBKey = this.reqData.iexSBKey
					}
				}
				catch (err) { console.log(`App: Error --> ${err}`) }
			},


			log() {
				console.log('%%% [APP] %%%')
				console.log('usertoken:', localStorage.usertoken)
				console.log('admintoken:', localStorage.admintoken)
			}
		},

		async created() {
			this.appKey++

			// [INIT] //
			await this.initializeApp()

			// [USER] checkIn //
			UserService.s_checkIn()

			// [SOCKET] //
			Socket.initialize()
			
			EventBus.$on('force-rerender', () => { this.appKey++ })

			// [LOG] //
			//this.log()
		},
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