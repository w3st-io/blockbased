<template>
	<section>
		<!-- Top Bar -->
		<article class="py-2 bg-dark bg-secondary border-bottom border-primary ctm-b">
			<div class="container">
				<nav class=" px-0 navbar navbar-expand-lg navbar-dark">
					<a class="navbar-brand" href="/">
						<h4>
							<mark class="bg-primary border border-secondary text-light">
								BlockBased
							</mark>
						</h4>
					</a>

					<!-- Hidden Menu Button -->
					<button
						class="navbar-toggler"
						@click="sideMenuBtnClicked"
					><span class="navbar-toggler-icon"></span></button>

					<!-- Top Menu -->
					<div class="collapse navbar-collapse">
						<div class="navbar-nav mr-auto"></div>
						<!-- Search and Button -->
						<div class="input-group" style="width: 300px;">
							<input
								type="text"
								placeholder="Search"
								class="form-control border-secondary bg-dark text-light"
							>
							<div class="input-group-append">
								<button class="btn btn-outline-secondary">Search</button>
							</div>
						</div>
					</div>
				</nav>
			</div>
		</article>
		
		<!-- Bottom Bar -->
		<article class="p-0 bg-dark border-bottom border-dark shadow-sm ctm-b">
			<div class="container">
				<nav class="px-0 py-1 navbar">
					<div class="mr-auto">
						<NotificationMenuBtn v-if="loggedIn" />
					</div>

					<div>
						<router-link v-if="!loggedIn" to="/login" class="ml-2">
							<button class="btn btn-sm btn-outline-secondary">Login</button>
						</router-link>

						<router-link v-if="!loggedIn" to="/register" class="ml-2">
							<button class="btn btn-sm btn-outline-primary">Register</button>
						</router-link>

						<router-link v-if="loggedIn" to="/profile" class="ml-2">
							<button class="btn btn-sm btn-outline-primary">{{ username }}</button>
						</router-link>

						<a v-if="loggedIn" v-on:click="logout" href="#" class="ml-2">
							<button class="btn btn-sm btn-outline-secondary">Log Out</button>
						</a>
					</div>
				</nav>
			</div>
		</article>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import NotificationMenuBtn from '@components/notifications/NotificationMenu'
	import router from '@router'
	import UserService from '@services/UserService'
	import { EventBus } from '@main'

	// [EXPORT] //
	export default {
		components: {
			NotificationMenuBtn
		},

		data: function() {
			return {
				loggedIn: false,
				user_id: 'unset',
				email: 'unset',
				username: 'unset',
				notifications: '',
				totalNotifications: 0,
			}
		},

		created: async function() {
			if (localStorage.usertoken) {
				// Set Status //
				this.loggedIn = true

				// Retrieve User Data //
				const decoded = await UserService.getUserTokenDecodeData()
				
				this.user_id = decoded._id
				this.email = decoded.email
				this.username = decoded.username

			}

			// [ON-EVENTBUS] //
			EventBus.$on('logged-in', () => { this.loggedIn = true })
		},

		methods: {
			logout() {
				localStorage.removeItem('usertoken')
				this.loggedIn = false
				router.push({ name: 'Login' })
			},
			redirectToQuote(query) {
				// [REDIRECT] // [EMIT OUT -->] // Clear Field //
				router.push({ path: `/quote/${query}` })
				EventBus.$emit('query')
				this.query = ''
			},
			sideMenuBtnClicked() {
				EventBus.$emit('navBarSideMenuBtnClicked')
			}
		},
	}
</script>


<style lang="scss" scoped>
	.ctm-b {}

	.dotted-bg {
		opacity: 1;
		background: #343a40;
		background-image:
			linear-gradient(#42484e 4px,transparent 0),
			linear-gradient(90deg,#42484e 4px,transparent 0)
		;
		background-size: 8px 8px,8px 8px;
	}
</style>