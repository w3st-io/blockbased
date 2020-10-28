<template>
	<!-- Footer -->
	<footer class="mt-5 pt-4 page-footer font-small bg-dark border-top border-secondary text-center">
		<b-button
			v-if="loggedIn"
			@click="logout()"
			variant="outline-secondary"
			size="sm"
			class="m-auto"
		>Log Out</b-button>

		<!-- Copyright -->
		<div class="pt-3 pb-5 footer-copyright text-secondary">
			© Copyright 2020:
			<a href="https://opall.io/"> opall.io</a>
			<h6><i class="text-dark">"Dare I say it..?"</i></h6>
		</div>
	</footer>
</template>

<script>
	import router from '@router'
	import { EventBus } from '@main'

	export default {
		data: function() {
			return {
				loggedIn: false,
			}
		},

		created: async function() {
			if (localStorage.usertoken) {
				this.loggedIn = true
			}
		},
		methods: {
			logout() {
				EventBus.$emit('logged-out')
				this.loggedIn = false

				router.push({ name: 'login' })
			},
		}
	}
</script>

<style scoped>
	* { color: white; }
</style>