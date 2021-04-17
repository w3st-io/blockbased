<template>
	<!-- Footer -->
	<footer class="pt-4 page-footer font-small bg-dark text-center">
		<BButton
			v-if="userLogged"
			variant="outline-secondary"
			size="sm"
			class="m-auto"
			@click="logout()"
		>Log Out</BButton>

		<!-- Copyright -->
		<div class="pt-3 pb-5 footer-copyright text-secondary">
			<a href="https://w3st.io/">w3st.io</a>
			© {{ new Date().getFullYear() }}
			<br>
			<a href="https://iexcloud.io">Data provided by IEX Cloud</a>
			<h6><i class="text-dark">"Dare I say it..?"</i></h6>
		</div>
	</footer>
</template>

<script>
	import router from '@/router'
	import UserService from '@/services/user/UserService'

	export default {
		data() {
			return {
				userLogged: false,
			}
		},

		created() {
			if (localStorage.usertoken) { this.userLogged = true }
		},
		
		methods: {
			logout() {
				UserService.s_logout()

				router.push({ name: 'user_login' })
			},
		}
	}
</script>

<style scoped>
	* { color: white; }
</style>