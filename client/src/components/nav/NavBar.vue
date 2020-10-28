<template>
	<section>
		<!-- Top Bar -->
		<article class="bg-dark bg-secondary border-bottom border-primary">
			<b-container>
				<nav class=" px-0 navbar navbar-expand-lg navbar-dark">
					<!-- Logo -->
					<router-link to="/" class="navbar-brand">
						<mark class="h4 bg-primary text-light">
							BlockBased.io
						</mark>
					</router-link>

					<!-- Hidden Menu Button -->
					<button class="navbar-toggler" @click="menuBtnClicked">
						<span class="navbar-toggler-icon"></span>
					</button>

					<!-- Top Menu -->
					<div class="collapse navbar-collapse">
						<div class="navbar-nav mr-auto"></div>
						<!-- Search and Button
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
						-->
					</div>
				</nav>
			</b-container>
		</article>
		
		<!-- Bottom Bar -->
		<article class="p-0 bg-dark border-bottom border-dark shadow-sm">
			<b-container>
				<b-navbar class="px-0 py-1">
					<div class="mr-auto">
						<button
							v-if="loggedIn"
							@click="followedRedirect()"
							class="ml-2 btn btn-sm btn-outline-light"
						>Followed Posts</button>

						<button
							v-if="loggedIn"
							@click="allActivityRedirect()"
							class="ml-2 btn btn-sm btn-outline-light"
						>All Activity</button>
					</div>

					<section>
						<!-- Logged In -->
						<NotificationMenuBtn v-if="loggedIn" />

						<b-button
							v-if="loggedIn"
							@click="profileRedirect()"
							variant="outline-primary"
							size="sm"
							class="ml-2"
						>{{ decoded.username }}</b-button>

						<!-- NOT Logged In -->
						<b-button
							v-if="!loggedIn"
							@click="logInRedirect()"
							variant="outline-secondary"
							size="sm"
						>Login</b-button>
						
						<b-button
							v-if="!loggedIn"
							@click="registerRedirect()"
							variant="outline-primary"
							size="sm"
							class="ml-2"
						>Register</b-button>
					</section>
				</b-navbar>
			</b-container>
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
				decoded: {},
				loggedIn: false,
				notifications: '',
				totalNotifications: 0,
			}
		},

		created: async function() {
			if (localStorage.usertoken) {
				this.loggedIn = true

				this.decoded = await UserService.getUserTokenDecodeData()
			}

			// [ON-EVENTBUS] //
			EventBus.$on('logged-in', () => { this.loggedIn = true })
		},

		methods: {
			logInRedirect() { router.push({ name: 'login' }) },

			registerRedirect() { router.push({ name: 'register' }) },

			profileRedirect() { router.push({ name: 'profile' }) },

			followedRedirect() {
				router.push({ name: 'user-followed', params: { page: 1 } })
			},

			allActivityRedirect() {
				router.push({ name: 'activity', params: { page: 1 } })
			},
			
			menuBtnClicked() { this.$emit('menu-btn-clicked') }
		},
	}
</script>