<template>
	<nav class="navbar navbar-dark fixed-bottom bg-warning border border-warning">
		<div>
			<BButton size="sm" @click="redirectAdmin()" class="mr-2">
				Admin Dashboard
			</BButton>
			
			<BButton size="sm" @click="redirectAdminFunction()" class="mr-2">
				Admin Function
			</BButton>

			<BButton size="sm" @click="redirectAdminProfile()" class="mr-2">
				Admin Profile
			</BButton>

			<BButton variant="warning" @click="logout()" class="mr-2 btn-sm">
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

			redirectAdminFunction() { router.push({ name: 'admin-function' }) },

			redirectAdminProfile() { router.push({ name: 'admin-profile' }) },
		},
	}
</script>