<template>
	<div id="app" :key="appKey">
		<!-- UI -->
		<UI />

		<!-- Router -->
		<RouterView :key="$route.name + ($route.params.id || '')" />

		<!-- Bottom Footer -->
		<Footer />

		<!-- Socket -->
		<Socket />
	</div>
</template>

<script>
	// [IMPORT] Personal //
	import Footer from '@/components/nav/Footer'
	import Socket from '@/components/socket'
	import UI from '@/components/UI'
	import { EventBus } from '@/main'
	import Service from '@/services/Service'

	// [EXPORT] //
	export default {
		name: 'App',

		components: {
			Footer,
			Socket,
			UI,
		},

		data() {
			return {
				appKey: 0,
				reqData: {},
			}
		},

		async created() {
			this.forceRerender()

			await this.setNodeEnv()
			
			EventBus.$on('force-rerender', () => { this.forceRerender() })

			// [LOG] //
			//this.log()
		},

		methods: {
			forceRerender() { this.appKey++ },

			async setNodeEnv() {
				try {
					this.reqData = await Service.index()

					if (this.reqData.status) {
						localStorage.setItem('node_env', this.reqData.node_env)
					}	
				}
				catch (err) { console.log(`App: Error --> ${err}`) }
			},

			log() {
				console.log('%%% [APP] %%%')
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