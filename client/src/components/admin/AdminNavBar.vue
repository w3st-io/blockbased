<template>
	<nav
		class="navbar fixed-bottom navbar-dark bg-warning border border-warning"
		style=""
	>
		<div>
			<router-link to="/admin" class="mr-2 btn btn-sm btn-secondary">
				Admin Dashboard
			</router-link>
			<router-link to="/admin/a-profile" class="mr-2 btn btn-sm btn-secondary">
				Admin Profile
			</router-link>
			<button @click="logout" class="mr-2 btn btn-sm btn-warning">logout</button>
		</div>
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