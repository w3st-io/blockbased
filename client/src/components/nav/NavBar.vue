<template>
	<section>
		<!-- Top Bar -->
		<article class="py-2 bg-info">
			<div class="container">
				<nav class=" px-0 navbar navbar-expand-lg navbar-dark bg-info">
					<a class="navbar-brand text-light" href="/"><h4><i>BlockBased</i></h4></a>
					<button class="navbar-toggler">
						<span class="navbar-toggler-icon"></span>
					</button>

					<!-- Top Menu -->
					<div class="collapse navbar-collapse">
						<div class="navbar-nav mr-auto"></div>
						<!-- Search and Button -->
						<div class="input-group" style="width: 300px;">
							<input type="text" placeholder="Search" class="form-control text-info">
							<div class="input-group-append">
								<button class="btn btn-outline-light">Button</button>
							</div>
						</div>
					</div>
				</nav>
			</div>
		</article>
		
		<!-- Bottom Bar -->
		<article class="p-0 bg-secondary shadow-sm">
			<div class="container">
				<nav class="px-0 py-1 navbar">
					<div class="mr-auto">
						<router-link to="/" class="mx-2 text-light">Home</router-link>
						<router-link to="/" class="mx-2 text-light">Forum</router-link>
					</div>
				
					<div>
						<router-link v-if="!loggedIn" to="/login" class="ml-2">
							<button class="btn btn-sm btn-info">Login</button>
						</router-link>

						<router-link v-if="!loggedIn" to="/register" class="ml-2">
							<button class="btn btn-sm btn-outline-info">Register</button>
						</router-link>

						<router-link v-if="loggedIn" to="/profile" class="ml-2">
							<button class="btn btn-sm btn-info">Your Account</button>
						</router-link>

						<a v-if="loggedIn" v-on:click="logout" href="#" class="ml-2">
							<button class="btn btn-sm btn-outline-info">Log Out</button>
						</a>
					</div>
				</nav>
			</div>
		</article>
	</section>
</template>

<script>
	/*** [IMPORT] Personal ***/
	import { EventBus } from '../../main'
	import router from '../../router'

	/*** [EXPORT] ***/
	export default {
		data: function() {
			return {
				loggedIn: false
			}
		},

		created: function() {
			if (localStorage.usertoken) { this.loggedIn = true }

			EventBus.$on('logged-in', () => { this.loggedIn = true })
		},

		methods: {
			logout() {
				localStorage.removeItem('usertoken')
				this.loggedIn = false
				router.push({ name: 'Login' })
			},
			redirectToQuote(query) {
				// [REDIRECT] // [EMIT OUT] --> // Clear Field //
				router.push({ path: `/quote/${query}` })
				EventBus.$emit('query')
				this.query = ''
			},
			sideMenuBtnClicked() {
				console.log('clicked')
				EventBus.$emit('navBarSideMenuBtnClicked')
			}
		},
	}
</script>