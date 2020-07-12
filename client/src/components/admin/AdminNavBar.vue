<template>
	<nav class="navbar fixed-bottom navbar-dark bg-danger">
		<div>
			<router-link to="/admin" class="px-2 text-white">Admin Dashboard</router-link>
			<router-link to="/admin-profile" class="px-2 text-white">Admin Profile</router-link>
		</div>
		<button v-on:click="logout" class="btn btn-light">Logout</button>
	</nav>
</template>

<script>
	// [IMPORT] Personal //
	import { EventBus } from '@main'

	// [EXPORT] //
	export default {
		methods: {
			logout() {
				localStorage.removeItem('admintoken')
				EventBus.$emit('admin-logged-out')
			},
		},
	}
</script>