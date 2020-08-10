<template>
	<nav class="navbar fixed-bottom navbar-dark bg-warning border border-warning">
		<div>
			<router-link to="/admin" class="mr-2 btn btn-secondary">
				Admin Dashboard
			</router-link>
			<router-link to="/admin-profile" class="btn btn-secondary">
				Admin Profile
			</router-link>
		</div>
		<button v-on:click="logout" class="btn btn-warning">Logout</button>
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