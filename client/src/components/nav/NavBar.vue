<template>
	<div>
		<!-- Top Bar -->
		<div class="bg-dark bg-secondary border-bottom border-primary">
			<BContainer>
				<nav class="px-0 navbar navbar-expand-lg navbar-dark">
					<!-- Logo -->
					<RouterLink to="/" class="navbar-brand">
						<mark class="h4 bg-primary text-light">
							BlockBased.io
						</mark>
					</RouterLink>

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
			</BContainer>
		</div>
		
		<!-- Bottom Bar -->
		<div class="p-0 bg-dark border-bottom border-dark shadow-sm">
			<BContainer>
				<BNavbar class="px-0 py-1">
					<div class="mr-auto">
						<BButton
							v-if="loggedIn"
							variant="outline-light"
							size="sm"
							@click="followedRedirect()"
							class="ml-2"
						>Followed Posts</BButton>

						<BButton
							variant="outline-light"
							size="sm"
							@click="allActivityRedirect()"
							class="ml-2"
						>All Activity</BButton>
					</div>

					<div>
						<!-- Logged In -->
						<NotificationMenuBtn v-if="loggedIn" />

						<BButton
							v-if="loggedIn"
							@click="profileRedirect()"
							variant="outline-primary"
							size="sm"
							class="ml-2"
						>{{ decoded.username }}</BButton>

						<!-- NOT Logged In -->
						<BButton
							v-if="!loggedIn"
							@click="logInRedirect()"
							variant="outline-secondary"
							size="sm"
						>Login</BButton>
						
						<BButton
							v-if="!loggedIn"
							@click="registerRedirect()"
							variant="outline-primary"
							size="sm"
							class="ml-2"
						>Register</BButton>
					</div>
				</BNavbar>
			</BContainer>
		</div>
	</div>
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
				router.push({
					name: 'activity',
					params: {
						sort: 1,
						limit: 10,
						page: 1
					}
				})
			},
			
			menuBtnClicked() { this.$emit('menu-btn-clicked') }
		},
	}
</script>