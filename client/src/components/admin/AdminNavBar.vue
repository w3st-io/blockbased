<template>
	<nav class="navbar navbar-dark fixed-bottom bg-warning">
		<div>
			<BButton size="sm" class="mr-2" @click="redirectAdmin()">
				Admin Dashboard
			</BButton>

			<BButton size="sm" class="mr-2" @click="redirectAdminProfile()">
				Admin Profile
			</BButton>

			<BButton variant="warning" class="mr-2 btn-sm" @click="logout()">
				Logout
			</BButton>
		</div>
	</nav>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@router'
	import { EventBus } from '@main'

	// [EXPORT] //
	export default {
		methods: {
			logout() {
				localStorage.removeItem('admintoken')
				EventBus.$emit('admin-logged-out')
			},

			redirectAdmin() { router.push({ name: 'admin' }) },

			redirectAdminProfile() { router.push({ name: 'admin-profile' }) },
		},
	}
</script>