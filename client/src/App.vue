<template>
	<div id="app">
		<nav-bar />

		<!-- Display the router Stuff -->
		<router-view :key="routerViewKey" />
	</div>
</template>

<script>
	import NavBar from './components/nav/NavBar'

	export default {
		name: 'App',
		components: {
			NavBar,
		},

		data() {
			return {
				routerViewKey: 0,
				loggedIn: false,
			}
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
