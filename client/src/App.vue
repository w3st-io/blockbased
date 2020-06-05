<template>
	<div id="app">
		<!-- Admin Bottom Bar -->
		<admin-nav-bar
			v-if="adminLoggedIn"
			:key="adminNavBarKey"
			@adminLoggedOut="forceRerender"
		/>

		<!-- Top Bar -->
		<nav-bar />

		<!-- Display the router Stuff -->
		<router-view :key="routerViewKey" />

		<!-- Bottom Footer -->
		<Footer />
	</div>
</template>

<script>
	/*** [IMPORT] Personal ***/
	import AdminNavBar from './components/admin/AdminNavBar'
	import Footer from './components/nav/Footer'
	import NavBar from './components/nav/NavBar'
	import { EventBus } from './main'

	/*** [EXPORT] ***/
	export default {
		name: 'App',
		components: {
			AdminNavBar,
			Footer,
			NavBar,
		},

		data: function() {
			return {
				adminNavBarKey: 0,
				routerViewKey: 0,
				adminLoggedIn: false,
				loggedIn: false,
			}
		},

		created: function() {
			// [CHECK IF ADMINLOGGEDIN] // [--> EMIT IN] //
			if (localStorage.admintoken) { this.adminLoggedIn = true }
			EventBus.$on('admin-logged-in', () => { this.adminLoggedIn = true })
		},

		methods: {
			forceRerender() {
				this.adminLoggedIn = false
				this.adminNavBarKey += 1
				this.routerViewKey += 1
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
