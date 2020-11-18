<template>
	<nav class="navbar navbar-dark fixed-bottom bg-warning border border-warning">
		<div>
			<RouterLink to="/admin" class="mr-2 btn btn-sm btn-secondary">
				Admin Dashboard
			</RouterLink>
			<RouterLink to="/admin/a-profile" class="mr-2 btn btn-sm btn-secondary">
				Admin Profile
			</RouterLink>
			<BButton variant="warning" @click="logout" class="mr-2 btn-sm">
				Logout
			</BButton>
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