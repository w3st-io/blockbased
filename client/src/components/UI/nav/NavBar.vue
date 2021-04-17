<template>
	<div>
		<!-- Top Bar -->
		<div class="bg-dark bg-secondary border-bottom border-primary">
			<BContainer>
				<nav class="px-0 navbar navbar-expand-lg navbar-dark">
					<!-- Logo -->
					<RouterLink to="/" class="navbar-brand">
						<mark class="h4 bg-primary text-light">
							{{ defaultData.companyName }}
						</mark>
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
						<RouterLink
							v-for="(button, i) in buttons"
							:key="i"
							:to="button.path"
						>
							<BButton variant="outline-light" size="sm" class="ml-2">
								<span v-if="button.text">{{ button.text }}</span>
								<span v-else v-html="button.navIcon"></span>
							</BButton>
						</RouterLink>
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
	import SideMenu from '@/components/UI/nav/SideMenu'
	import defaultData from '@/defaults/companyInfo'
	import buttons from '@/defaults/pageLinks'
	import router from '@/router'
	import UserService from '@/services/user/UserService'
	import { EventBus } from '@/main'

	// [EXPORT] //
	export default {
		components: {
			NotificationMenu,
			SideMenu,
		},

		data() {
			return {
				defaultData: defaultData,
				decoded: {},
				userLogged: false,
				query: '',
				notifications: '',
				totalNotifications: 0,
				buttons: buttons,

				// [MENU] //
				sideMenuOpen: false,
			}
		},

		async created() {
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