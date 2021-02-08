<template>
	<div>
		<!-- Top Bar -->
		<div class="bg-dark bg-secondary border-bottom border-primary">
			<BContainer>
				<nav class="px-0 navbar navbar-expand-lg navbar-dark">
					<!-- Logo -->
					<RouterLink to="/" class="navbar-brand">
						<mark class="h4 bg-primary text-light">BlockBased.io</mark>
					</RouterLink>

					<!-- Hidden Menu Button -->
					<button class="navbar-toggler" @click="toggle()">
						<span class="navbar-toggler-icon"></span>
					</button>

					<!-- Top Menu -->
					<div class="collapse navbar-collapse">
						<div class="navbar-nav mr-auto"></div>
						<!-- Search and Button -->
						<form class="input-group" style="width: 300px;">
							<input
								v-model="query"
								type="text"
								placeholder="Search"
								class="form-control border-secondary bg-dark text-light"
							>
							<div class="input-group-append">
								<BButton
									:disabled="!query"
									variant="outline-secondary"
									type="submit"
									@click="searchRedirect()"
								>Search</BButton>
							</div>
						</form>
					</div>
				</nav>
			</BContainer>
		</div>
		
		<!-- Bottom Bar -->
		<div class="p-0 bg-dark border-bottom border-dark shadow-sm">
			<BContainer>
				<BNavbar class="px-0 py-1">
					<div class="mr-auto d-none d-sm-block">
						<BButton
							v-if="userLogged"
							variant="outline-light"
							size="sm"
							class=""
							@click="followedRedirect()"
						>Followed Posts</BButton>

						<BButton
							variant="outline-light"
							size="sm"
							class="ml-2"
							@click="allActivityRedirect()"
						>All Activity</BButton>
					</div>

					<div>
						<!-- Logged In -->
						<NotificationMenu v-if="userLogged" />

						<BButton
							v-if="userLogged"
							variant="outline-primary"
							size="sm"
							class="ml-2"
							@click="profileRedirect()"
						>{{ decoded.username }}</BButton>

						<!-- NOT Logged In -->
						<BButton
							v-if="!userLogged"
							variant="outline-secondary"
							size="sm"
							@click="loginRedirect()"
						>Login</BButton>
						
						<BButton
							v-if="!userLogged"
							variant="outline-primary"
							size="sm"
							class="ml-2"
							@click="registerRedirect()"
						>Register</BButton>
					</div>
				</BNavbar>
			</BContainer>
		</div>

		<!-- Hidden Side Menu -->
		<SideMenu :sideMenuOpen="sideMenuOpen" @closeMenu="toggle()" />
	</div>
</template>

<script>
	// [IMPORT] Personal //
	import NotificationMenu from '@/components/notifications/NotificationMenu'
	import SideMenu from '@/components/nav/SideMenu'
	import router from '@/router'
	import UserService from '@/services/UserService'
	import { EventBus } from '@/main'

	// [EXPORT] //
	export default {
		components: {
			NotificationMenu,
			SideMenu,
		},

		data() {
			return {
				decoded: {},
				userLogged: false,
				query: '',
				notifications: '',
				totalNotifications: 0,

				// [MENU] //
				sideMenuOpen: false,
			}
		},

		created: async function() {
			await this.userTasks()

			if (localStorage.usertoken) { this.userLogged = true }
		},

		methods: {
			async userTasks() {
				try {
					if (localStorage.usertoken) {
						this.userLogged = true

						this.decoded = await UserService.s_getUserTokenDecodeData()
					}
				}
				catch (err) { console.log(`Navbar: ${err}`) }
			},

			loginRedirect() { router.push({ name: 'user_login' }) },

			registerRedirect() { router.push({ name: 'register' }) },

			profileRedirect() { router.push({ name: 'user_profile' }) },

			followedRedirect() {
				router.push({
					name: 'user_followed',
					params: { page: 1 }
				})
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

			searchRedirect() {
				if (this.query) {
					router.push({
						name: 'search',
						params: {
							type: 'posts',
							query: this.query,
							limit: 5,
							page: 1,
						}
					})
	
					EventBus.$emit('force-rerender')
				}
			},

			toggle() { this.sideMenuOpen = !this.sideMenuOpen },
		},
	}
</script>